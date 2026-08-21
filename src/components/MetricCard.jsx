const MetricCard = ({ label, value, detail, accent }) => (
  <article className="animate-rise rounded-sm border border-[#ded6ca] bg-[#fffdf8] p-5 sm:p-6">
    <div className="flex items-start justify-between">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#788078]">
        {label}
      </p>
      <span className={`h-2 w-2 rounded-full ${accent}`} />
    </div>
    <p className="mt-4 text-4xl font-bold tracking-tight">{value}</p>
    <p className="mt-2 font-sans text-xs text-[#788078]">{detail}</p>
  </article>
);
export default MetricCard;
