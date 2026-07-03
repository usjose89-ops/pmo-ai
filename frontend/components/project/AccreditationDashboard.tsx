"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, Search, Filter, Download, Edit2 } from 'lucide-react';
import { PersonProfileModal } from './PersonProfileModal';

const GENERAL_OPTIONS = ['No Iniciado', 'En proceso', 'Aprobado', 'N/A'];
const PSYCH_OPTIONS = ['No Iniciado', 'En proceso', 'OK - Dentro de lo esperado', 'Obs. Bajo lo esperado', 'N/A'];
const HEALTH_OPTIONS = ['No Iniciado', 'En proceso', 'Aprobado', 'Alterado', 'N/A'];

const HDR_COLUMNS = [
    'carta_oferta', 'docs_mel', 'contrato', 'ficha_trab_mel', 'cert_anteced', 'cedula_ident'
];

const MEL_COLUMNS = [
    'examen_med', 'test_ad', 'altura_geo', 'altura_fis', 'psicosenso', 'aversion_riesgo',
    'adecuacion_normas', 'capacidad_atencion', 'trabajo_presion', 'conducta_precavida', 'control_impulsos', 'disp_aprendizaje', 'estabilidad_emocional',
    'regl_transp', 'portal_pmf', 'coaching_3d', 'ceim_3d', 'sup_izaje', 'asist_izaje', 'lic_rigger', 'lic_interna', 'lic_operador'
];

const initialMockData = [
    {
        id: 'P01', codigo: 'ADM_01', cargo: 'Administrador Contrato', nombre: 'Andrés Tebes',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'N/A', docs_mel: 'N/A', contrato: 'Aprobado', ficha_trab_mel: 'N/A', cert_anteced: 'No Iniciado', cedula_ident: 'N/A',
        regl_transp: 'N/A', portal_pmf: 'N/A', coaching_3d: 'No Iniciado', ceim_3d: 'No Iniciado', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: '', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P02', codigo: 'HSEC_01', cargo: 'Asesor de Seguridad', nombre: 'Juan Carlos Santander',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'N/A', docs_mel: 'N/A', contrato: 'Aprobado', ficha_trab_mel: 'N/A', cert_anteced: 'No Iniciado', cedula_ident: 'N/A',
        regl_transp: 'N/A', portal_pmf: 'N/A', coaching_3d: 'No Iniciado', ceim_3d: 'No Iniciado', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: '', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P03', codigo: 'JT_01', cargo: 'Jefe de Terreno', nombre: 'Leonel Sanchez',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'N/A', contrato: 'Aprobado', ficha_trab_mel: 'N/A', cert_anteced: 'N/A', cedula_ident: 'N/A',
        regl_transp: 'N/A', portal_pmf: 'N/A', coaching_3d: 'No Iniciado', ceim_3d: '08-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P04', codigo: 'SUP_01', cargo: 'Supervisor de Terreno', nombre: 'Ulises Psijas',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'En proceso', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'No Iniciado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'No Iniciado', ceim_3d: '08-06-2026', sup_izaje: '05-06-2026', asist_izaje: 'N/A', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: '09-06-2026', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P05', codigo: 'ADM_02', cargo: 'Encargado Administrativo', nombre: 'Jesenia Tapia',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'No Iniciado', contrato: 'Aprobado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'No Iniciado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'No Iniciado', ceim_3d: 'N/A', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P06', codigo: 'TOPO_01', cargo: 'Topógrafo', nombre: 'Manuel Tapia',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: 'N/A',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'Aprobado', contrato: 'Aprobado', ficha_trab_mel: 'Aprobado', cert_anteced: 'Aprobado', cedula_ident: 'Aprobado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: 'N/A', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: '', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P07', codigo: 'M1_01', cargo: 'Maestro 1° Líneas', nombre: 'Orlando Maita',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'No Iniciado', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '08-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: '', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P08', codigo: 'M1_02', cargo: 'Maestro 1° Líneas', nombre: 'Wilmer Chambi',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'No Iniciado', contrato: 'Aprobado', ficha_trab_mel: 'Aprobado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '04-06-2026', sup_izaje: '11-06-2026', asist_izaje: 'N/A', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P09', codigo: 'M1_03', cargo: 'Maestro 1° Líneas', nombre: 'David Flores',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'En proceso', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '04-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P10', codigo: 'M1_04', cargo: 'Maestro 1° Líneas', nombre: 'Wilber Corrales',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'En proceso', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '05-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P11', codigo: 'M1_05', cargo: 'Maestro 1° Líneas', nombre: 'Ronald Orellana',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'En proceso', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '05-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P12', codigo: 'M1_06', cargo: 'Maestro 1° Líneas', nombre: 'Maica Villca',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'No Iniciado', contrato: 'Aprobado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '04-06-2026', sup_izaje: 'N/A', asist_izaje: '09-06-2026', lic_rigger: 'N/A',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P13', codigo: 'M1_07', cargo: 'Maestro 1° Líneas', nombre: 'Fredy Arena',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'No Iniciado', contrato: 'Aprobado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '04-06-2026', sup_izaje: 'N/A', asist_izaje: '09-06-2026', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P14', codigo: 'M2_01', cargo: 'Maestro 2° Líneas', nombre: 'Roly Ipurani',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'En proceso', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '05-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'No Iniciado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P15', codigo: 'M2_02', cargo: 'Maestro 2° Líneas', nombre: 'Erasmo Castellon',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'N/A', aversion_riesgo: 'Alterado', indicadores_riesgo: '4 de 7 ; 57%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'Obs. Bajo lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'Obs. Bajo lo esperado',
        carta_oferta: 'En proceso', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '05-06-2026', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'N/A',
        fecha_envio_cyd: '', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    },
    {
        id: 'P16', codigo: 'OP_01', cargo: 'Operador', nombre: 'Matias Quiñenao',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'Aprobado', docs_mel: 'No Iniciado', contrato: 'Aprobado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'Aprobado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'Aprobado', ceim_3d: '08-06-2026', sup_izaje: 'N/A', asist_izaje: 'Aprobado', lic_rigger: 'N/A',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'Aprobado', lic_operador: 'No Iniciado', observaciones: 'Sincronizado'
    },
    {
        id: 'P17', codigo: 'RIG_01', cargo: 'Rigger', nombre: 'Mauro Vega',
        examen_med: 'Aprobado', test_ad: 'Aprobado', altura_geo: 'Aprobado', altura_fis: 'Aprobado', psicosenso: 'Aprobado', aversion_riesgo: 'Aprobado', indicadores_riesgo: '7 de 7 ; 100%',
        adecuacion_normas: 'OK - Dentro de lo esperado', capacidad_atencion: 'OK - Dentro de lo esperado', trabajo_presion: 'OK - Dentro de lo esperado', conducta_precavida: 'OK - Dentro de lo esperado', control_impulsos: 'OK - Dentro de lo esperado', disp_aprendizaje: 'OK - Dentro de lo esperado', estabilidad_emocional: 'OK - Dentro de lo esperado',
        carta_oferta: 'No Iniciado', docs_mel: 'No Iniciado', contrato: 'No Iniciado', ficha_trab_mel: 'No Iniciado', cert_anteced: 'No Iniciado', cedula_ident: 'No Iniciado',
        regl_transp: 'No Iniciado', portal_pmf: 'No Iniciado', coaching_3d: 'No Iniciado', ceim_3d: 'No Iniciado', sup_izaje: 'N/A', asist_izaje: 'N/A', lic_rigger: 'Aprobado',
        fecha_envio_cyd: 'N/A', estatus_cyd: 'No Iniciado', lic_interna: 'N/A', lic_operador: 'N/A', observaciones: 'Sincronizado'
    }
];

export function AccreditationDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('hrAccreditationData_v6');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            const calculated = initialMockData.map(row => calculateMetrics(row));
            setData(calculated);
            localStorage.setItem('hrAccreditationData_v6', JSON.stringify(calculated));
        }
    }, []);

    const calculateMetrics = (row: any) => {
        const isApproved = (val: string) => {
            if (!val || val === 'N/A' || val === 'No Iniciado' || val === 'En proceso' || val === 'Alterado' || val === 'Obs. Bajo lo esperado') return false;
            return true; // Any date, 'Aprobado', 'OK - Dentro de lo esperado'
        };

        // HDR
        let hdrApp = 0; let hdrTot = 0;
        HDR_COLUMNS.forEach(col => {
            if (row[col] !== 'N/A') {
                hdrTot++;
                if (isApproved(row[col])) hdrApp++;
            }
        });
        const avance_hdr = hdrTot === 0 ? 100 : (hdrApp / hdrTot) * 100;

        // MEL
        let melApp = 0; let melTot = 0;
        MEL_COLUMNS.forEach(col => {
            if (row[col] !== 'N/A') {
                melTot++;
                if (isApproved(row[col])) melApp++;
            }
        });
        const cumpl_mel = melTot === 0 ? 100 : (melApp / melTot) * 100;

        // Consolidado
        const cumpl_consolidado = (avance_hdr + cumpl_mel) / 2;

        let estado_final = 'No Iniciado';
        let semaforo = 'Rojo';
        if (cumpl_consolidado === 100) {
            estado_final = 'Aprobado';
            semaforo = 'Verde';
        } else if (cumpl_consolidado > 0) {
            estado_final = 'En proceso';
            semaforo = 'Amarillo';
        }

        return { ...row, avance_hdr, cumpl_mel, cumpl_consolidado, estado_final, semaforo };
    };

    const handleStatusChange = (rowId: string, columnKey: string, newValue: string) => {
        const newData = data.map(row => {
            if (row.id === rowId) {
                const updatedRow = { ...row, [columnKey]: newValue };
                return calculateMetrics(updatedRow);
            }
            return row;
        });
        setData(newData);
        localStorage.setItem('hrAccreditationData_v5', JSON.stringify(newData));
    };

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-white text-slate-700';
        if (status === 'Aprobado' || status === 'OK - Dentro de lo esperado' || status === 'Verde') return 'bg-[#92d050] text-slate-800 font-bold';
        if (status === 'Obs. Bajo lo esperado' || status === 'En proceso' || status === 'Amarillo') return 'bg-transparent text-amber-600 font-bold';
        if (status === 'Alterado' || status === 'No Iniciado' || status === 'Rojo') return 'bg-transparent text-red-500 font-bold';
        if (status === 'N/A') return 'bg-slate-200 text-slate-500 font-medium';
        return 'bg-white text-slate-700 font-medium';
    };

    const formatPercent = (val: number) => `${val.toFixed(1)}%`;

    const columnsHeaderLevel2 = [
        // Salud Física y Altura
        { key: 'examen_med', label: 'Examen Méd.', width: 'w-24', isHealth: true },
        { key: 'test_ad', label: 'Test A&D', width: 'w-24', isHealth: true },
        { key: 'altura_geo', label: 'Gran Altura Geo.', width: 'w-28', isHealth: true },
        { key: 'altura_fis', label: 'Gran Altura Fís.', width: 'w-28', isHealth: true },
        
        // Psicosenso y Riesgo
        { key: 'psicosenso', label: 'Psicosenso.', width: 'w-24', isHealth: true },
        { key: 'aversion_riesgo', label: 'Aversión Riesgo', width: 'w-28', isHealth: true },
        { key: 'indicadores_riesgo', label: 'Indicadores Medidos', width: 'w-36', isText: true },
        
        // Perfil Psicológico
        { key: 'adecuacion_normas', label: 'Adec. normas/proc.', width: 'w-36', isPsych: true },
        { key: 'capacidad_atencion', label: 'Atención/concentración', width: 'w-36', isPsych: true },
        { key: 'trabajo_presion', label: 'Trabajo bajo presión', width: 'w-36', isPsych: true },
        { key: 'conducta_precavida', label: 'Conducta precavida', width: 'w-36', isPsych: true },
        { key: 'control_impulsos', label: 'Control impulsos', width: 'w-36', isPsych: true },
        { key: 'disp_aprendizaje', label: 'Disp. aprendizaje', width: 'w-36', isPsych: true },
        { key: 'estabilidad_emocional', label: 'Estabil. emocional', width: 'w-36', isPsych: true },

        // Hoja de Ruta (HDR)
        { key: 'carta_oferta', label: 'Carta Oferta', width: 'w-28' },
        { key: 'docs_mel', label: 'Doc. Solicitados MEL', width: 'w-36' },
        { key: 'contrato', label: 'Contrato/Anexo', width: 'w-32' },
        { key: 'ficha_trab_mel', label: 'Ficha Trab. MEL', width: 'w-32' },
        { key: 'cert_anteced', label: 'Cert. Anteced.', width: 'w-32' },
        { key: 'cedula_ident', label: 'Cédula Ident.', width: 'w-28' },

        // Cursos y Plataformas MEL
        { key: 'regl_transp', label: 'Regl. Transp', width: 'w-28' },
        { key: 'portal_pmf', label: 'Portal PMF', width: 'w-28' },
        { key: 'coaching_3d', label: 'Coaching 3D', width: 'w-28' },
        { key: 'ceim_3d', label: '3D-CEIM', width: 'w-32', isText: true },

        // Especialidades de Izaje
        { key: 'sup_izaje', label: 'Supervisor Izaje', width: 'w-32' },
        { key: 'asist_izaje', label: 'Asistente Izaje', width: 'w-32' },
        { key: 'lic_rigger', label: 'Lic. Rigger', width: 'w-28' },

        // Carpeta CyD
        { key: 'fecha_envio_cyd', label: 'Fecha Envío CyD', width: 'w-32', isText: true },
        { key: 'estatus_cyd', label: 'Estatus CyD', width: 'w-28' },

        // Licencias Extra
        { key: 'lic_interna', label: 'Cursos Inatrans', width: 'w-32' },
        { key: 'lic_operador', label: 'Lic. Operador', width: 'w-28' },

        // Fórmulas
        { key: 'avance_hdr', label: 'Avance HDR [%]', width: 'w-28', isFormula: true },
        { key: 'cumpl_mel', label: '% Cumpl. MEL', width: 'w-28', isFormula: true },
        { key: 'estado_final', label: 'Estado Final', width: 'w-28', isFormula: true },
        { key: 'semaforo', label: 'Semáforo', width: 'w-28', isFormula: true },
        { key: 'cumpl_consolidado', label: 'Cumpl. Consolidado', width: 'w-32', isFormula: true },
        { key: 'observaciones', label: 'Observaciones', width: 'w-32', isText: true },
    ];

    return (
        <div className="space-y-6 pb-20">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800">Matriz de Acreditación de Personal (MEL)</h3>
                        <p className="text-xs text-slate-500">Vista consolidada con todos los procesos y fórmulas finales de acreditación.</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto relative w-full" style={{ maxWidth: '100%' }}>
                    <table className="w-max min-w-full text-left text-xs border-collapse">
                        <thead className="bg-[#1f497d] text-white">
                            <tr>
                                <th colSpan={3} className="py-2 border-r border-slate-500/30 text-center sticky left-0 z-20 bg-[#1f497d]">Identificación</th>
                                <th colSpan={4} className="py-2 border-r border-slate-500/30 text-center bg-[#002060]">Salud Física y Altura</th>
                                <th colSpan={3} className="py-2 border-r border-slate-500/30 text-center bg-[#1f497d]">Psicosensotécnica y Riesgo</th>
                                <th colSpan={7} className="py-2 border-r border-slate-500/30 text-center bg-[#002060]">Perfil Psicológico</th>
                                <th colSpan={6} className="py-2 border-r border-slate-500/30 text-center bg-[#1f497d]">Hoja de Ruta (HDR) y Documentos</th>
                                <th colSpan={4} className="py-2 border-r border-slate-500/30 text-center bg-[#002060]">Cursos y Plataformas MEL</th>
                                <th colSpan={3} className="py-2 border-r border-slate-500/30 text-center bg-[#1f497d]">Especialidades Izaje</th>
                                <th colSpan={2} className="py-2 border-r border-slate-500/30 text-center bg-[#002060]">Carpeta CyD</th>
                                <th colSpan={2} className="py-2 border-r border-slate-500/30 text-center bg-[#1f497d]">Licencias Externas</th>
                                <th colSpan={6} className="py-2 border-r border-slate-500/30 text-center bg-[#002060]">Indicadores Finales</th>
                            </tr>
                            <tr className="text-[9px] uppercase font-bold text-center bg-[#002060]">
                                <th className="py-2 px-2 border-r border-slate-500/30 sticky left-0 z-20 bg-[#002060] w-12">ID</th>
                                <th className="py-2 px-2 border-r border-slate-500/30 sticky z-20 bg-[#002060] w-32" style={{ left: '3rem' }}>Cargo</th>
                                <th className="py-2 px-2 border-r border-slate-500/30 sticky z-20 bg-[#002060] w-48" style={{ left: '11rem' }}>Nombre</th>
                                
                                {columnsHeaderLevel2.map(col => (
                                    <th key={col.key} className={`py-2 px-2 border-r border-slate-500/30 ${col.width}`}>
                                        <div className="truncate">{col.label}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.map((row) => (
                                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="sticky left-0 bg-white border-r border-slate-200 py-2 px-2 font-mono text-slate-500 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">
                                        {row.id}
                                    </td>
                                    <td className="sticky bg-white border-r border-slate-200 py-2 px-2 font-bold text-slate-700 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center" style={{ left: '3rem' }}>
                                        <div className="truncate w-[110px]">{row.cargo}</div>
                                    </td>
                                    <td className="sticky bg-white border-r border-slate-200 py-2 px-2 font-bold z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-left cursor-pointer hover:bg-slate-100" style={{ left: '11rem' }}>
                                        <div className="w-[170px] truncate text-slate-900">{row.nombre}</div>
                                    </td>
                                    
                                    {columnsHeaderLevel2.map(col => {
                                        if (col.isFormula) {
                                            const isPercent = col.key.includes('cumpl') || col.key.includes('avance');
                                            const val = row[col.key];
                                            const displayVal = isPercent ? formatPercent(val as number) : val;

                                            return (
                                                <td key={col.key} className={`border-r border-slate-200 py-2 px-2 text-center bg-slate-100 font-mono font-bold text-[10px] ${getStatusColor(val)}`}>
                                                    {displayVal}
                                                </td>
                                            );
                                        }

                                        if (col.isText) {
                                            return (
                                                <td key={col.key} className={`border-r border-slate-200 py-1 px-1 text-center ${getStatusColor(row[col.key])}`}>
                                                    <input 
                                                        type="text"
                                                        value={row[col.key] || ''}
                                                        onChange={(e) => handleStatusChange(row.id, col.key, e.target.value)}
                                                        className="w-full bg-transparent text-center font-semibold text-[10px] outline-none p-1 placeholder-slate-400"
                                                        placeholder={col.key === 'ceim_3d' ? "DD-MM-YYYY o Estado" : "Escribe..."}
                                                    />
                                                </td>
                                            );
                                        }

                                        let options = GENERAL_OPTIONS;
                                        if (col.isHealth) options = HEALTH_OPTIONS;
                                        if (col.isPsych) options = PSYCH_OPTIONS;

                                        return (
                                            <td key={col.key} className={`border-r border-slate-200 py-1 px-1 text-center ${getStatusColor(row[col.key])}`}>
                                                <select 
                                                    value={row[col.key] || 'No Iniciado'}
                                                    onChange={(e) => handleStatusChange(row.id, col.key, e.target.value)}
                                                    className={`w-full bg-transparent text-center font-semibold outline-none cursor-pointer p-1 appearance-none hover:bg-black/5 rounded text-[10px]`}
                                                    style={{ textAlignLast: 'center' }}
                                                >
                                                    {options.map(opt => (
                                                        <option key={opt} value={opt} className="text-slate-800 bg-white">{opt}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedPerson && <PersonProfileModal isOpen={!!selectedPerson} person={selectedPerson} onClose={() => setSelectedPerson(null)} onSave={() => {}} />}
        </div>
    );
}
