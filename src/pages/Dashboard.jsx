import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, MousePointerClick } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUrlData } from "../store/stores/urlSlice";
import UrlComposer from "../components/UrlComposer";
import UrlsAnalytics from "../components/UrlsAnalytics";
import MetricCard from "../components/MetricCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { urls, overview, insights, loading, error } = useSelector(
    (state) => state.url,
  );
  const user = useSelector((state) => state.auth.user);
  const [editingUrl, setEditingUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchUrlData());
  }, [dispatch]);

  useEffect(() => {
    const refresh = () => dispatch(fetchUrlData({ silent: true }));
    const handleVisibility = () => document.visibilityState === "visible" && refresh();

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchUrlData({ silent: true }));
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch]);
  //   useEffect(() => {
  //   dispatch(fetchUrlData());

  //   const refreshUrls = () => dispatch(fetchUrlData({ silent: true }));
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") refreshUrls();
  //   };

  //   window.addEventListener("focus", refreshUrls);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   const refreshInterval = window.setInterval(refreshUrls, 2000);

  //   return () => {
  //     window.removeEventListener("focus", refreshUrls);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     window.clearInterval(refreshInterval);
  //   };
  // }, [dispatch]);
  return (
    <div className="py-8 sm:py-12">
      <header className="animate-rise mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Workspace / Overview</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Good to see you
            <span className="text-[#b6533d]">
              {user?.name ? `, ${user.name.split(" ")[0]}` : "user"}.
            </span>
          </h1>
          <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-[#687069]">
            Turn unwieldy destinations into clean, memorable links and keep a
            close eye on what happens next.
          </p>
        </div>
        <div className="flex items-center gap-2 font-sans text-xs text-[#788078]">
          <Activity size={15} className="text-[#b6533d]" /> Live workspace
        </div>
      </header>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total links"
          value={overview?.totalUrls || 0}
          detail="Across your workspace"
          accent="bg-[#e7c66c]"
        />
        <MetricCard
          label="Total visits"
          value={(
            overview?.totalVisits ||
            overview?.totalVisitors ||
            0
          ).toLocaleString()}
          detail="All-time engagement"
          accent="bg-[#6c9a72]"
        />
        <MetricCard
          label="Active links"
          value={overview?.activeUrls || 0}
          detail="Ready to share"
          accent="bg-[#b6533d]"
        />
        <MetricCard
          label="Expired links"
          value={overview?.expiredUrls || 0}
          detail="Need your attention"
          accent="bg-[#8b8176]"
        />
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <UrlComposer
          editingUrl={editingUrl}
          onClose={() => setEditingUrl(null)}
        />
        <aside className="animate-rise delay-1 rounded-sm bg-[#202523] p-6 text-[#fffaf1]">
          <p className="eyebrow text-[#e7c66c]">Small observation</p>
          <div className="mt-5 flex gap-3">
            <MousePointerClick
              className="mt-1 shrink-0 text-[#e7c66c]"
              size={20}
            />
            <p className="font-sans text-sm leading-6">
              {insights?.[0] ||
                "Your next useful insight starts with your first link."}
            </p>
          </div>
          {insights?.[1] && (
            <p className="mt-5 border-t border-white/15 pt-4 font-sans text-xs leading-5 text-white/60">
              {insights[1]}
            </p>
          )}
          <a
            href="#url-library"
            className="mt-7 inline-flex items-center gap-2 font-sans text-xs font-bold text-[#e7c66c]"
          >
            View library <ArrowUpRight size={14} />
          </a>
        </aside>
      </div>
      {error && (
        <p className="mb-4 rounded border border-[#e4b8aa] bg-[#f8e8e3] px-4 py-3 font-sans text-sm text-[#9b5a4e]">
          {error}
        </p>
      )}
      <div id="url-library">
        <UrlsAnalytics urls={urls} onEdit={setEditingUrl} />
      </div>
      {loading && urls.length > 0 && (
        <p className="mt-3 text-right font-sans text-xs text-[#788078]">
          Refreshing library...
        </p>
      )}
    </div>
  );
};

export default Dashboard;
