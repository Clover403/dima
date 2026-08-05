import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NodeId, NodeDef } from "./ProcesodiagramaData";
import { NODES, C } from "./ProcesodiagramaData";

type Props = {
  active: NodeId | null;
  activeNode: NodeDef | null;
  setActive: React.Dispatch<React.SetStateAction<NodeId | null>>;
};

export default function ProcesodiagramaRightPanel({
  active,
  activeNode,
  setActive,
}: Props) {
  return (
    <div className="relative lg:w-[45%] flex items-center justify-center px-6 md:px-10 lg:pl-6 lg:pr-14 py-12 lg:py-16 lg:sticky lg:top-0 lg:h-screen">
      <AnimatePresence mode="wait">
        {!activeNode && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-start gap-8 max-w-md w-full lg:-translate-x-4"
          >
            <div className="flex flex-col gap-2 w-full opacity-20">
              {[80, 55, 40].map((w, i) => (
                <div
                  key={i}
                  className="h-px bg-[#E5997B]"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-[#E5997B]/50" />
              <span className="font-mono text-[#E5997B] text-[14px] tracking-[0.5em] uppercase">
                Seleccione un nodo
              </span>
            </div>

            <p
              className="font-display text-[#F4F4F5] text-7xl md:text-7xl leading-tight"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontStyle: "italic",
              }}
            >
              9 etapas.
              <br />
              <span className="text-[#E5997B]">Un objetivo.</span>
            </p>

            <p
              className="text-[#F4F4F5]/70 text-2xl md:text-3xl leading-relaxed max-w-md"
              style={{
                fontFamily: "'Inter Tight',sans-serif",
                fontWeight: 300,
              }}
            >
              Haz clic en cualquier nodo del diagrama para explorar cada
              etapa del proceso de estructuración financiera de DIMA.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              {NODES.filter((n) => n.id !== "iterate").map((n) => (
                <button
                  key={n.id}
                  onClick={() => setActive(n.id)}
                  className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 rounded-full border transition-all duration-200"
                  style={{
                    borderColor: ["1", "2", "3", "4"].includes(n.id)
                      ? "rgba(0,180,180,0.3)"
                      : "rgba(229,153,123,0.3)",
                    color: ["1", "2", "3", "4"].includes(n.id)
                      ? C.teal
                      : C.bronze,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = ["1", "2", "3", "4"].includes(
                      n.id,
                    )
                      ? "rgba(0,180,180,0.1)"
                      : "rgba(229,153,123,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeNode && (
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="flex flex-col gap-8 max-w-md w-full lg:-translate-x-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-px"
                style={{
                  background: ["1", "2", "3", "4"].includes(activeNode.id)
                    ? C.teal
                    : C.bronze,
                }}
              />
              <span
                className="font-mono text-[14px] tracking-[0.5em] uppercase"
                style={{
                  color: ["1", "2", "3", "4"].includes(activeNode.id)
                    ? C.teal
                    : C.bronze,
                }}
              >
                {activeNode.tag}
              </span>
            </div>

            <span
              className="font-mono text-[#F4F4F5]/15 text-[110px] leading-none select-none"
              style={{ fontWeight: 100 }}
            >
              {activeNode.label}
            </span>

            <h3
              className="text-[#F4F4F5] text-8xl md:text-8xl leading-snug -mt-8"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 400,
              }}
            >
              {activeNode.title}
            </h3>

            <div className="h-px w-full bg-[#F4F4F5]/20" />

            <p
              className="text-[#F4F4F5]/85 text-4xl md:text-3xl leading-relaxed"
              style={{
                fontFamily: "'Inter Tight',sans-serif",
                fontWeight: 300,
                fontSize: "1.6rem",
              }}
            >
              {activeNode.description}
            </p>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setActive(null)}
                className="font-mono text-[10px] tracking-[0.4em] uppercase flex items-center gap-2 transition-colors duration-200"
                style={{ color: "rgba(244,244,245,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.bronze)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(244,244,245,0.3)")
                }
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Cerrar
              </button>

              <div className="flex gap-4">
                {(() => {
                  const ids: NodeId[] = [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "iterate",
                    "6",
                    "7",
                    "8",
                    "9",
                  ];
                  const cur = ids.indexOf(active! as NodeId);
                  const prev = ids[cur - 1];
                  const next = ids[cur + 1];
                  return (
                    <>
                      <button
                        onClick={() => prev && setActive(prev)}
                        disabled={!prev}
                        className="font-mono text-[10px] tracking-[0.35em] uppercase flex items-center gap-1.5 disabled:opacity-20 transition-colors duration-200"
                        style={{ color: "rgba(244,244,245,0.4)" }}
                        onMouseEnter={(e) => {
                          if (prev) e.currentTarget.style.color = C.white;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(244,244,245,0.4)";
                        }}
                      >
                        <svg width="14" height="10" viewBox="0 0 12 8" fill="none">
                          <path d="M8 1 L3 4 L8 7" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        Prev
                      </button>
                      <button
                        onClick={() => next && setActive(next)}
                        disabled={!next}
                        className="font-mono text-[10px] tracking-[0.35em] uppercase flex items-center gap-1.5 disabled:opacity-20 transition-colors duration-200"
                        style={{ color: "rgba(244,244,245,0.4)" }}
                        onMouseEnter={(e) => {
                          if (next) e.currentTarget.style.color = C.white;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(244,244,245,0.4)";
                        }}
                      >
                        Next
                        <svg width="14" height="10" viewBox="0 0 12 8" fill="none">
                          <path d="M4 1 L9 4 L4 7" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              {(
                [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "iterate",
                  "6",
                  "7",
                  "8",
                  "9",
                ] as NodeId[]
              ).map((id) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: active === id ? "24px" : "6px",
                    height: "6px",
                    background:
                      active === id
                        ? ["1", "2", "3", "4"].includes(id)
                          ? C.teal
                          : C.bronze
                        : "rgba(244,244,245,0.2)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
