import type { Priority, RankedComponentRisk, RankedVulnerability } from "./types";

export interface Remediation {
  title: string;
  summary: string;
  example: string;
  verify: string;
}

interface CatalogEntry {
  tests: RegExp[];
  remediation: Remediation;
}

const CATALOG: CatalogEntry[] = [
  {
    tests: [/preventbackup/i, /backup configuration/i, /allowbackup/i],
    remediation: {
      title: "Desactivar copias de seguridad inseguras",
      summary:
        "Una app Android con allowBackup habilitado permite extraer datos de usuario con adb backup o herramientas forenses.",
      example:
        '<application\n  android:allowBackup="false"\n  android:fullBackupContent="@xml/backup_rules">',
      verify: "Confirme android:allowBackup=false en el manifesto de release y pruebe que adb backup no extrae datos.",
    },
  },
  {
    tests: [/debuggable/i, /do not release debuggable/i],
    remediation: {
      title: "Publicar solo builds no depurables",
      summary: "android:debuggable=true en release abre el proceso a inspeccion y bypass de controles.",
      example: '<application android:debuggable="false">\n// gradle: buildTypes.release { isDebuggable = false }',
      verify: "aapt dump xmltree app.apk AndroidManifest.xml | grep debuggable debe ser 0x0 en release.",
    },
  },
  {
    tests: [/exported activity/i, /exportedactivit/i],
    remediation: {
      title: "Restringir activities exportadas",
      summary: "Una activity exportada sin permiso puede ser lanzada por cualquier app del dispositivo.",
      example:
        '<activity android:name=".SensitiveActivity"\n  android:exported="false" />\n// Si debe exportarse:\nandroid:permission="app.permission.INTERNAL"',
      verify: "Revise exported=true y asigne un permission signature o cambie a exported=false.",
    },
  },
  {
    tests: [/exported service/i, /exportedservice/i],
    remediation: {
      title: "Restringir servicios exportados",
      summary: "Un service exportado sin permiso permite a terceros invocar logica interna.",
      example:
        '<service android:name=".SyncService"\n  android:exported="false" />',
      verify: "dumpsys package <pkg> y confirme que los services sensibles no son exported.",
    },
  },
  {
    tests: [/internet permission/i, /permission usage conformance/i],
    remediation: {
      title: "Justificar y minimizar INTERNET",
      summary: "El permiso INTERNET es necesario, pero debe ir acompasado de cleartextTrafficPermitted=false y certificate pinning.",
      example:
        '<application android:usesCleartextTraffic="false">\n<uses-permission android:name="android.permission.INTERNET" />\n// OkHttp CertificatePinner para sus hosts',
      verify: "Deshabilite HTTP claro y verifique que solo los hosts previstos reciben trafico.",
    },
  },
  {
    tests: [/sensitive information into configuration/i, /hardcoded secret/i, /api.?key/i],
    remediation: {
      title: "Sacar secretos de archivos de configuracion",
      summary: "Claves, tokens o URLs con credenciales en xml/properties/gradle se extraen del APK.",
      example:
        "// No: api_key=sk_live_...\nval key = BuildConfig.API_KEY // inyectado por CI\n// o EncryptedSharedPreferences / Keystore",
      verify: "Busque secretos en el APK (strings, resources) y rote cualquier valor ya publicado.",
    },
  },
  {
    tests: [/injection/i, /sql/i, /xss/i],
    remediation: {
      title: "Eliminar inyeccion con APIs parametrizadas",
      summary: "Concatenar entrada de usuario en SQL, HTML o comandos es explotable.",
      example:
        "// Mal: db.execSQL(\"SELECT * FROM u WHERE id=\" + id)\n// Bien: db.query(\"u\", null, \"id=?\", arrayOf(id), ...)",
      verify: "Revise cada frontera de datos no confiables y anada pruebas de payload malicioso.",
    },
  },
  {
    tests: [/information leak/i, /sensitive information/i, /log\./i],
    remediation: {
      title: "Dejar de registrar datos sensibles",
      summary: "Logs, toasts o archivos de configuracion no deben contener PII, tokens ni datos de sesion.",
      example:
        "// Mal: Log.d(TAG, \"token=\" + session)\n// Bien: Log.d(TAG, \"auth.ok\")  // sin payload",
      verify: "Filtre logcat en release (ProGuard/R8) y busque patrones de token/password.",
    },
  },
  {
    tests: [/assignment in condition/i, /assignments into conditional/i],
    remediation: {
      title: "Separar asignacion y condicion",
      summary: "Asignar dentro de un if oculta errores y cambia el flujo previsto.",
      example: "// Mal: if (x = next()) {}\nconst next = read();\nif (next) { ... }",
      verify: "Active el linter de asignacion en condiciones y no mutee la regla.",
    },
  },
  {
    tests: [/dead code/i],
    remediation: {
      title: "Eliminar codigo muerto",
      summary: "Codigo inalcanzable aumenta superficie de mantenimiento y oculta defectos reales.",
      example: "// Borrar funciones no referenciadas.\n// Si es un hook futuro, documente y cubra con test o elimine.",
      verify: "IDE unused-symbol + cobertura: el archivo no debe quedar con ramas a 0%.",
    },
  },
  {
    tests: [/cyclomatic/i, /nested if/i, /too many param/i],
    remediation: {
      title: "Reducir complejidad",
      summary: "Metodos densos son dificiles de probar y concentran defectos de fiabilidad.",
      example:
        "// Extraiga early-returns y funciones de <20 lineas.\nfun process(order: Order) {\n  if (!order.valid) return\n  bill(order)\n}",
      verify: "Fije un umbral de complejidad ciclomatica en CI (p. ej. 10) y falle el build al superarlo.",
    },
  },
  {
    tests: [/100kb/i, /pages should not exceed/i, /noscript/i],
    remediation: {
      title: "Aligerar el artefacto web",
      summary: "Paginas pesadas y sin noscript degradan rendimiento y accesibilidad.",
      example:
        "Comprima CSS/JS e imagenes.\n<noscript>Esta aplicacion requiere JavaScript.</noscript>",
      verify: "Mida el peso transferido < 100 KB gzip y compruebe el fallback noscript.",
    },
  },
  {
    tests: [/exception, runtimeexception/i, /throwable in catch/i, /empty body/i],
    remediation: {
      title: "Capturar excepciones concretas",
      summary: "catch (Exception) o cuerpos vacios ocultan fallos de seguridad y de datos.",
      example:
        "try {\n  parse(input)\n} catch (e: JsonParseException) {\n  logger.warn(\"invalid.payload\")\n  throw BadRequest()\n}",
      verify: "Prohiba catch de Exception/Throwable en SAST y cubra el camino de error con un test.",
    },
  },
  {
    tests: [/object instantiation into loops/i],
    remediation: {
      title: "Evitar instanciar objetos en bucles calientes",
      summary: "Crear objetos dentro de un loop aumenta GC y latencia en rutas frecuentes.",
      example:
        "val buffer = StringBuilder()\nfor (item in items) buffer.append(item.id)",
      verify: "Perfile la ruta (Android Studio CPU/memory) y confirme menor alocacion por frame.",
    },
  },
  {
    tests: [/api levels/i, /required api/i],
    remediation: {
      title: "Declarar min/target SDK explicitos",
      summary: "Sin API level el sistema no aplica protecciones modernas (scoped storage, export defaults).",
      example:
        "android {\n  defaultConfig {\n    minSdk = 26\n    targetSdk = 35\n  }\n}",
      verify: "merged manifest debe mostrar minSdkVersion y targetSdkVersion coherentes con la politica.",
    },
  },
  {
    tests: [/unreliable variable/i, /unary operators with objects/i],
    remediation: {
      title: "Acceder solo a datos confiables",
      summary: "Propiedades no validadas o coerciones numericas sobre objetos producen fallos y bypass.",
      example:
        "val amount = payload.amount ?: return\nrequire(amount > 0)\ncharge(amount)",
      verify: "Anada tests de nulos y tipos en los limites del modulo.",
    },
  },
];

const CWE_FALLBACK: Record<string, Remediation> = {
  "CWE-16": {
    title: "Corregir configuracion insegura",
    summary: "El defecto es de configuracion. Fije valores seguros por defecto en el artefacto de release.",
    example: "Defina un profile release con defaults restrictivos y falle el CI si el manifesto se desvia.",
    verify: "Compare el manifesto merged de release contra una lista blanca.",
  },
  "CWE-200": {
    title: "Cerrar fugas de informacion",
    summary: "No exponga datos internos en UI, logs, backups ni archivos de configuracion.",
    example: "Elimine el campo sensible o enmascarelo (*** + ultimos 4) antes de persistir o registrar.",
    verify: "Busque el dato en APK, logcat y copias de seguridad.",
  },
  "CWE-265": {
    title: "Ajustar privilegios al minimo",
    summary: "Permisos excesivos amplian el impacto de cualquier otra vulnerabilidad.",
    example: "Conserve solo los uses-permission que la historia de usuario demuestra, con runtime request.",
    verify: "dumpsys package y Play Console: lista de permisos = la minima necesaria.",
  },
  "CWE-396": {
    title: "No tragar excepciones genericas",
    summary: "Capturar Exception/RuntimeException esconde fallos explotables.",
    example: "Catch del tipo concreto, registre un codigo y relance o responda 4xx/5xx controlado.",
    verify: "Un test debe cubrir el error y demostrar que no se silencia.",
  },
};

export function remediateFinding(item: {
  rule: string;
  ruleCode: string;
  cwe?: string[];
  vulnerabilityType?: string;
  characteristic?: string;
}): Remediation {
  const haystack = `${item.ruleCode} ${item.rule} ${item.vulnerabilityType ?? ""}`;
  for (const entry of CATALOG) {
    if (entry.tests.some((test) => test.test(haystack))) {
      return entry.remediation;
    }
  }
  for (const cwe of item.cwe ?? []) {
    const mapped = CWE_FALLBACK[cwe];
    if (mapped) return mapped;
  }
  const area = item.characteristic || "calidad";
  return {
    title: `Plan de correccion (${area})`,
    summary: `Priorice este hallazgo de ${area.toLowerCase()} porque aparece entre los 10 de mayor severidad del analisis.`,
    example:
      "1) Reproduzca el caso en un test que falle.\n2) Corrija la causa, no el sintoma.\n3) Agregue la regla a la puerta de CI.",
    verify: "El test nuevo pasa y la regla Kiuwan queda en estado resuelto o muted con justificacion.",
  };
}

export function remediateComponent(item: RankedComponentRisk): Remediation {
  if (item.vulnerabilityCount > 0 || item.cves.length > 0 || (item.cvssMax ?? 0) >= 7) {
    return {
      title: "Actualizar o sustituir el componente vulnerable",
      summary: "Hay CVE o riesgo de seguridad asociado. No deje la version actual en produccion.",
      example:
        `// Gradle\nimplementation("${item.name}:${nextVersionHint(item.version)}")\n// y regenere el SBOM`,
      verify: "Vuelva a correr SCA: el CVE no debe aparecer, o documente excepcion con fecha de salida.",
    };
  }
  if (item.licenses.length > 0 && !/artefactos de build/i.test(item.name)) {
    return {
      title: "Documentar y validar la licencia",
      summary: `Este componente declara: ${item.licenses.join(", ")}. Unknown en riesgo de licencia no significa libre de obligaciones.`,
      example: `SBOM:\n  name: ${item.name}\n  version: ${item.version || "<version>"}\n  license: ${item.licenses[0]}\nAgregue NOTICE y dictamen legal antes de distribuir.`,
      verify: "SPDX queda resuelto (no Unknown) y el inventario legal incluye este artefacto.",
    };
  }
  if (/high|critical/i.test(item.licenseRisk)) {
    return {
      title: "Resolver el riesgo de licencia",
      summary: "Una licencia copyleft o desconocida puede contaminar la distribucion del producto.",
      example:
        "Sustituya el artefacto por una alternativa permissiva (Apache-2.0/MIT) o aíslelo en un proceso separado con dictamen legal.",
      verify: "El SBOM debe listar SPDX conocido y el equipo legal debe firmar el uso.",
    };
  }
  if (/high|critical|medium/i.test(item.obsolescenceRisk) || item.obsolescenceRisk === "Low") {
    return {
      title: "Plan de actualizacion por obsolescencia",
      summary: "El componente esta desfasado. Cada mes sin parche aumenta la probabilidad de CVE.",
      example:
        `Dependabot/Renovate: agrupe ${shortName(item.name)} y suba a la ultima version estable en un PR dedicado.`,
      verify: "La version instalada coincide con la ultima estable del mantenedor.",
    };
  }
  return {
    title: "Identificar el componente en el inventario",
    summary:
      "El artefacto no tiene coordenadas claras (nombre hash o riesgo Unknown). Sin identidad no hay parche.",
    example:
      "Excluya directorios build/intermediates del analisis SCA y declare el GAV real (group:artifact:version) en el manifiesto de dependencias.",
    verify: "Kiuwan Insight debe mostrar nombre, version y licencia, no un hash de dex/jar intermedio.",
  };
}

export function remediateQuality(item: RankedVulnerability): Remediation {
  return remediateFinding(item);
}

function nextVersionHint(version: string): string {
  if (!version || version === "-" || version === "sin version") return "<ultima-estable>";
  return `${version} -> <ultima-estable>`;
}

function shortName(name: string): string {
  if (name.length < 42) return name;
  if (/^[a-f0-9]{24,}/i.test(name)) return `${name.slice(0, 12)}...`;
  return `${name.slice(0, 38)}...`;
}

export function priorityTone(priority: Priority): [number, number, number] {
  switch (priority) {
    case "very-high":
      return [176, 48, 48];
    case "high":
      return [180, 110, 20];
    case "medium":
      return [36, 92, 160];
    default:
      return [90, 100, 114];
  }
}
