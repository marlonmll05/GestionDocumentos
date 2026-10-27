"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconTrash,
  IconFolder,
  IconScan,
  IconLogout,
  IconSearch,
  IconFolderOpen,
  IconUpload,
  IconPlus,
} from "@tabler/icons-react";
import { centroInterface, getCentros } from "@/lib/api/centros";
import { buscarPacientes, nombreCompleto, Paciente } from "@/lib/api/pacientes";
import { Documentos, getDocumentos } from "@/lib/api/documentos";
import { DigitalInterface, getCentrosDigitalizacion } from "@/lib/api/digitalizacion";

/* ---------- shared classes ---------- */

const card = "rounded-lg border border-[#c9cdb8] bg-white p-4 shadow-sm";
const label = "mb-1 block text-sm font-semibold text-[#3f4a2e]";
const field =
  "w-full rounded-md border border-[#c9cdb8] bg-[#f7f8f3] p-2 text-sm text-black outline-none focus:border-[#4b5320] focus:ring-2 focus:ring-[#4b5320]/30";

const columnas = [
  "Id Archivo",
  "Centro Digital",
  "Código Doc",
  "Descripción Doc",
  "Tipo Ext",
  "Tamaño",
  "Descargar",
  "Eliminar",
];

/* ---------- Toolbar ---------- */

function Toolbar() {
  const router = useRouter();

  const botones = [
    { icon: IconTrash, label: "Limpiar", onClick: () => {} },
    { icon: IconFolder, label: "Carpeta", onClick: () => {} },
    { icon: IconScan, label: "Escanear", onClick: () => {} },
    { icon: IconLogout, label: "Salir", onClick: () => router.push("/login") },
  ];

  return (
    <div className="flex gap-2">
      {botones.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          onClick={onClick}
          className="grid h-10 w-10 place-items-center rounded-lg border border-[#5c6b2e] bg-[#4b5320] text-[#eef1e6] transition hover:bg-[#5c6b2e]"
        >
          <Icon size={20} stroke={1.75} />
        </button>
      ))}
    </div>
  );
}

/* ---------- SelectorEmpresa ---------- */

function SelectorEmpresa({ onSelect }: { onSelect: (empresa: string) => void }) {
  const [centros, setCentros] = useState<centroInterface[] | null>();

  const obtenerCentros = async () => {
    const res = await getCentros();
    setCentros(res);
  };

  useEffect(() => {
    obtenerCentros();
  }, []);

  return (
    <div className={card}>
      <label htmlFor="empresa" className={label}>
        Empresa de trabajo
      </label>
      <select
        id="empresa"
        onChange={(e) => onSelect(e.target.value)}
        className={field}
      >
        <option value="">Seleccionar</option>
        {centros?.map((m) => (
          <option key={m.$id} value={m.Empresa}>
            {m.Empresa}-{m.Nombre_Empresa}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- BuscarCaso + ModalPacientes ---------- */

function BuscarCaso({ onSelect }: { onSelect: (p: Paciente) => void }) {
  const [caso, setCaso] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = async () => {
    setError(null);
    setCargando(true);
    try {
      const res = await buscarPacientes(caso);
      if (res.length === 0) {
        setError("No se encontraron pacientes para ese caso");
        return;
      }
      setPacientes(res);
      setAbierto(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo buscar el caso");
    } finally {
      setCargando(false);
    }
  };

  const elegir = (p: Paciente) => {
    onSelect(p);
    setAbierto(false);
  };

  return (
    <div className={card}>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="caso" className={label}>
            Caso No.
          </label>
          <input
            id="caso"
            type="text"
            value={caso}
            onChange={(e) => setCaso(e.target.value)}
            className={field}
          />
        </div>

        <button
          type="button"
          onClick={buscar}
          disabled={!caso || cargando}
          className="grid h-10 w-10 place-items-center rounded-md bg-[#4b5320] text-white transition hover:bg-[#3f4a2e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconSearch size={18} />
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {abierto && (
        <ModalPacientes
          pacientes={pacientes}
          onSelect={elegir}
          onCerrar={() => setAbierto(false)}
        />
      )}
    </div>
  );
}

function ModalPacientes({
  pacientes,
  onSelect,
  onCerrar,
}: {
  pacientes: Paciente[];
  onSelect: (p: Paciente) => void;
  onCerrar: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onCerrar} // click on the dark area closes it
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()} // clicks inside don't close it
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-[#3f4a2e]">Selecciona un paciente</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="text-[#6b7057] hover:text-[#4b5320]"
          >
            ✕
          </button>
        </div>

        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {pacientes.map((p) => (
            <li key={p.$id}>
              <button
                type="button"
                onClick={() => onSelect(p)}
                className="w-full rounded-md border border-[#c9cdb8] p-2 text-left text-sm text-black hover:bg-[#eef1e6]"
              >
                {nombreCompleto(p)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- DatosPaciente ---------- */

function DatosPaciente({ paciente }: { paciente: Paciente | null }) {
  if (!paciente) return null;

  return (
    <div className={card}>
      <p className="text-sm font-semibold text-[#3f4a2e]">Paciente</p>
      <p className="text-sm text-black">{nombreCompleto(paciente)}</p>
    </div>
  );
}

/* ---------- SubirArchivo ---------- */

function SubirArchivo({ empresa }: { empresa: string }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [asociado, setAsociado] = useState<"AC" | "AP" | null>(null);

  const [tipoDocumento, setTipoDocumento] = useState<Documentos[]>([]);
  const [digitalizacion, setDigitalizacion] = useState<DigitalInterface[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [errorTipos, setErrorTipos] = useState<string | null>(null);

  const cargarDocumentos = async (tipo: "AP" | "AC") => {
    setErrorTipos(null);
    try {
      const response = await getDocumentos(tipo);
      setTipoDocumento(response);
    } catch (error) {
      setErrorTipos(
        error instanceof Error ? error.message : "No se pudo cargar los tipos de documentos"
      );
      setTipoDocumento([]);
    }
  };

  const cargarCentrosDigitales = async (empresa: string) => {
    setErrorTipos(null);
    try {
      const response = await getCentrosDigitalizacion(empresa);
      setDigitalizacion(response);
    } catch (error) {
      setErrorTipos(
        error instanceof Error ? error.message : "No se pudo cargar los centros"
      );
      setDigitalizacion([]);
    }
  };

  useEffect(() => {
    if (!empresa) {
      setDigitalizacion([]);
      return;
    }
    cargarCentrosDigitales(empresa);
  }, [empresa]);

  const elegirAsociado = (tipo: "AP" | "AC") => {
    setAsociado(tipo);
    setTipoSeleccionado("");
    cargarDocumentos(tipo);
  };

  return (
    <div className="space-y-5 rounded-lg border border-[#c9cdb8] bg-white p-4 shadow-sm">
      {/* radios + tipo de documento */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[#2c3319]">
            <input
              type="radio"
              name="asociado"
              value="AP"
              checked={asociado === "AP"}
              onChange={() => elegirAsociado("AP")}
              className="h-4 w-4 accent-[#4b5320]"
            />
            Asociado al Paciente
          </label>
          <label className="flex items-center gap-2 text-sm text-[#2c3319]">
            <input
              type="radio"
              name="asociado"
              value="AC"
              checked={asociado === "AC"}
              onChange={() => elegirAsociado("AC")}
              className="h-4 w-4 accent-[#4b5320]"
            />
            Asociado al Caso
          </label>
        </div>

        <div className="min-w-[220px] flex-1">
          <label htmlFor="tipoDoc" className={label}>
            Tipo de documento
          </label>
          <select id="tipoDoc" className={field}>
            <option>Seleccione...</option>
            {tipoDocumento.map((m) => (
              <option key={m.TipoDoc} value={m.TipoDoc}>
                {m.Descripcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* archivo */}
      <div>
        <p className="mb-2 text-sm font-semibold text-[#3f4a2e]">Archivo a subir</p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="archivo"
            className="whitespace-nowrap text-sm font-semibold text-[#3f4a2e]"
          >
            Dirección:
          </label>
          <input
            id="archivo"
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setNombreArchivo(e.target.files?.[0]?.name ?? "")}
          />
          <input
            type="text"
            readOnly
            value={nombreArchivo}
            placeholder="Ningún archivo seleccionado"
            className="flex-1 rounded-md border border-[#c9cdb8] bg-[#f7f8f3] p-2 text-sm text-[#6b7057] outline-none"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#c9cdb8] bg-[#f7f8f3] text-[#4b5320] transition hover:bg-[#eef1e6]"
          >
            <IconFolderOpen size={18} />
          </button>
        </div>
      </div>

      {/* centro digitalizacion + subir */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="centroDigitalizacion" className={label}>
            Centro de digitalización
          </label>
          <select id="centroDigitalizacion" className={field}>
            <option value="">Seleccionar</option>
            {digitalizacion.map((m) => (
              <option key={m.$id} value={m.ruta}>
                {m.Nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={!nombreArchivo}
          className="flex items-center gap-2 rounded-md bg-[#4b5320] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3f4a2e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconUpload size={18} />
          Subir archivo
        </button>
      </div>
    </div>
  );
}

/* ---------- RelacionDocumentos ---------- */

function RelacionDocumentos() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-semibold text-[#3f4a2e]">Relación de documentos</h2>
        <label htmlFor="filtroCentro" className="text-sm text-[#6b7057]">
          Filtros » Centro Dig:
        </label>
        <select
          id="filtroCentro"
          className="rounded-full border border-[#c9cdb8] bg-white px-3 py-1 text-sm outline-none focus:border-[#4b5320]"
        >
          <option>Todos</option>
        </select>
        <input
          aria-label="Buscar documento"
          placeholder="Doc"
          className="ml-auto w-40 rounded-md border border-[#c9cdb8] bg-white px-3 py-1 text-sm outline-none focus:border-[#4b5320]"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#c9cdb8] bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#c9cdb8] bg-[#eef1e6] text-[#3f4a2e]">
              <th className="w-10 p-3">
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos"
                  className="h-4 w-4 accent-[#4b5320]"
                />
              </th>
              {columnas.map((c) => (
                <th key={c} className="p-3 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columnas.length + 1}
                className="p-6 text-center text-[#9aa084]"
              >
                Sin documentos para mostrar
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- VistaPrevia ---------- */

function VistaPrevia() {
  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-lg border border-[#c9cdb8] bg-white p-3 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-[#3f4a2e]">Vista previa</p>
      <div className="flex flex-1 items-center justify-center rounded-md bg-[#f7f8f3] text-sm text-[#9aa084]">
        Selecciona un documento para verlo aquí
      </div>
    </div>
  );
}

/* ---------- Home ---------- */

export default function Home() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [empresa, setEmpresa] = useState("");

  return (
    <main className="min-h-screen bg-[#f2f3ec] p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#3f4a2e]">
            Gestión Documentos Digitales
          </h1>
          <Toolbar />
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <SelectorEmpresa onSelect={setEmpresa} />
            <BuscarCaso onSelect={setPaciente} />
            <DatosPaciente paciente={paciente} />
            <SubirArchivo empresa={empresa} />
            <RelacionDocumentos />
          </div>

          <VistaPrevia />
        </div>

        <footer className="flex items-center justify-between text-sm text-[#3f4a2e]">
          <span>
            Usuario conectado: <strong>MARLON FADIM MORALES LLANOS</strong>
          </span>
          <button
            type="button"
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            Ampliar
            <IconPlus size={16} />
          </button>
        </footer>
      </div>
    </main>
  );
}