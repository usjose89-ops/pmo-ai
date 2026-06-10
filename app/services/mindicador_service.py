import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta

class MindicadorService:
    """
    Servicio de conexión a mindicador.cl para rescatar UF, USD y UTM.
    Posee mecanismo de caché simple en memoria (1 hora de TTL) y valores de fallback estáticos
    para blindar la aplicación frente a caídas del Banco Central o del servicio externo.
    """
    
    _cache = None
    _last_fetch = None
    _CACHE_TTL_HOURS = 1

    @classmethod
    def _get_db_fallbacks(cls) -> dict:
        """
        Consulta la tabla cost_parameters para obtener valores de contingencia dinámicos.
        Si no existen, usa el estándar realista 2026.
        """
        # Estándar realista 2026 en caso de DB vacía
        fallbacks = {
            "uf": 39800.0,
            "dolar": 980.0,
            "utm": 66000.0
        }
        try:
            # Lazy import to avoid circular dependencies
            from app.database import SessionLocal
            from app.models import CostParameter
            
            db = SessionLocal()
            try:
                uf_param = db.query(CostParameter).filter(CostParameter.name == "FALLBACK_UF").first()
                if uf_param: fallbacks["uf"] = float(uf_param.value)
                
                usd_param = db.query(CostParameter).filter(CostParameter.name == "FALLBACK_USD").first()
                if usd_param: fallbacks["dolar"] = float(usd_param.value)
                
                utm_param = db.query(CostParameter).filter(CostParameter.name == "FALLBACK_UTM").first()
                if utm_param: fallbacks["utm"] = float(utm_param.value)
            finally:
                db.close()
        except Exception as e:
            print(f"[MindicadorService] Obviando DB fallbacks por error: {e}")
            
        return fallbacks

    @classmethod
    def get_indicators(cls) -> dict:
        """
        Retorna mapa con valores reales, ej:
        { "uf": 38120.5, "dolar": 978.4, "utm": 65900.0 }
        """
        # Chequear Caché
        if cls._cache and cls._last_fetch:
            if datetime.now() - cls._last_fetch < timedelta(hours=cls._CACHE_TTL_HOURS):
                print("[MindicadorService] Usando indicadores desde caché.")
                return cls._cache

        url = "https://mindicador.cl/api"
        # Obtener los fallbacks de manera dinámica por si falla el API Nacional
        dynamic_fallbacks = cls._get_db_fallbacks()

        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'ConstructIA-PMO/1.0'}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.getcode() == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    
                    uf_value = data.get("uf", {}).get("valor", dynamic_fallbacks["uf"])
                    dolar_value = data.get("dolar", {}).get("valor", dynamic_fallbacks["dolar"])
                    utm_value = data.get("utm", {}).get("valor", dynamic_fallbacks["utm"])

                    cls._cache = {
                        "uf": float(uf_value),
                        "dolar": float(dolar_value),
                        "utm": float(utm_value)
                    }
                    cls._last_fetch = datetime.now()
                    print(f"[MindicadorService] ¡Conexión Exitosa a la API! Extraído UF: {cls._cache['uf']}, USD: {cls._cache['dolar']}, UTM: {cls._cache['utm']}")
                    return cls._cache
                else:
                    raise ValueError(f"HTTP Status {response.getcode()}")

        except (urllib.error.URLError, Exception) as e:
            print(f"[MindicadorService] ⚠️ ERROR conectando a mindicador.cl: {e}")
            print(f"[MindicadorService] Aplicando valores de FALLBACK Dinámico DB: UF={dynamic_fallbacks['uf']}")
            return dynamic_fallbacks

