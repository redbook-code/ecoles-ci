"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function CompteurAnime({ valeur }: { valeur: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const estVisible = useInView(ref, { once: true });
  const [affiche, setAffiche] = useState(0);
  const compte = useMotionValue(0);

  useEffect(() => {
    if (estVisible) {
      const controls = animate(compte, valeur, {
        duration: 1.5,
        onUpdate: (v) => setAffiche(Math.floor(v)),
      });
      return controls.stop;
    }
  }, [estVisible, valeur, compte]);

  return <span ref={ref}>{affiche.toLocaleString("fr-FR")}</span>;
}

export default function AnimatedStats({
  totalEcoles,
  totalVilles,
  totalVerifiees,
}: {
  totalEcoles: number;
  totalVilles: number;
  totalVerifiees: number;
}) {
  return (
    <section className="bg-blue-50 py-12">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-3xl sm:text-4xl font-bold text-blue-900">
            <CompteurAnime valeur={totalEcoles} />+
          </p>
          <p className="text-sm text-zinc-600 mt-1">Établissements</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-3xl sm:text-4xl font-bold text-blue-900">
            <CompteurAnime valeur={totalVilles} />+
          </p>
          <p className="text-sm text-zinc-600 mt-1">Villes couvertes</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-3xl sm:text-4xl font-bold text-blue-900">
            <CompteurAnime valeur={totalVerifiees} />+
          </p>
          <p className="text-sm text-zinc-600 mt-1">Écoles vérifiées</p>
        </motion.div>
      </div>
    </section>
  );
}