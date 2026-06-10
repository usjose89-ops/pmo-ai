from decimal import Decimal

class LogisticsCalculator:
    
    @staticmethod
    def apply_client_rules(project_model, headcount: int):
        """
        Calculates hidden indirect costs based on Client Profile Rules.
        Returns a Dictionary of extra costs.
        """
        # Support current model (`project.client`) and legacy model (`project.client_profile`)
        client_profile = getattr(project_model, "client", None) or getattr(project_model, "client_profile", None)
        if not client_profile:
            return {"breakdown": {}, "total_setup_cost": Decimal(0)}

        client_rules = client_profile.rules_config or {}
        extra_costs = {}
        total_logistics = Decimal(0)
        
        # RULE 1: Accreditation Costs (The "Escondida" Rule)
        if client_rules.get("accreditation_days", 0) > 0:
            days = client_rules["accreditation_days"]
            # Hotel Cost during accreditation (e.g., Antofagasta Hotel)
            hotel_rate = Decimal(client_rules.get("hotel_rate_clp", 85000))
            
            # Medical Exams (Batería 3D)
            medical_cost = Decimal(client_rules.get("medical_exam_clp", 150000))
            
            # Cost = (Hotel * Days * People) + (Exams * People) + (Labor Cost Lost?)
            # Simplified for Logistics Budget:
            acc_cost = (hotel_rate * Decimal(days) * Decimal(headcount)) + (medical_cost * Decimal(headcount))
            
            extra_costs["accreditation_logistics"] = acc_cost
            total_logistics += acc_cost

        # RULE 2: Travel / Flights
        if client_rules.get("requires_flights", False):
            # Assume 7x7 shift = 2 roundtrips per month
            flights_per_month = 2
            flight_cost = Decimal("250000") # CLP Avg Santiago-Calama/Antofagasta
            
            monthly_travel = flight_cost * Decimal(flights_per_month) * Decimal(headcount)
            extra_costs["monthly_travel_budget"] = monthly_travel
            
        # RULE 3: Vehicle Standards
        if client_rules.get("vehicle_standard") == "MINE_SPEC_4X4":
            extra_costs["fleet_surcharge"] = "Requires Red Mining leasing rates (+30%)"
            
        return {
            "breakdown": extra_costs,
            "total_setup_cost": total_logistics
        }
