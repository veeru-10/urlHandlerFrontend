import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteUrl } from "../store/stores/urlSlice";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value))
    : "Never";
const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:5050";
const shortLink = (value) => `${API_URL}/api/urls/${value}`;

const UrlsAnalytics = ({ urls = [], onEdit }) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(null);
  const [urlToDelete, setUrlToDelete] = useState(null);

  useEffect(() => {
    if (!urlToDelete) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setUrlToDelete(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [urlToDelete]);

  const copy = async (url) => {
    await navigator.clipboard.writeText(shortLink(url.shortUrl));
    setCopied(url._id);
    window.setTimeout(() => setCopied(null), 1600);
  };
  const remove = () => {
    if (!urlToDelete) return;
    dispatch(deleteUrl(urlToDelete._id));
    setUrlToDelete(null);
  };
  return (
    <section className="animate-rise delay-2 overflow-hidden rounded-sm border border-[#ded6ca] bg-[#fffdf8]">
      <div className="flex items-center justify-between border-b border-[#e7e0d6] px-5 py-5 sm:px-7">
        <div>
          <p className="eyebrow">Link library</p>
          <h2 className="mt-1 text-2xl font-bold">Your URLs</h2>
        </div>
        <span className="font-sans text-xs text-[#788078]">
          {urls.length} {urls.length === 1 ? "link" : "links"}
        </span>
      </div>
      {urls.length === 0 ? (
        <div className="px-7 py-16 text-center">
          <p className="text-xl font-bold">Your library is waiting.</p>
          <p className="mt-2 font-sans text-sm text-[#788078]">
            Shorten your first URL above and its performance will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="font-sans text-[10px] uppercase tracking-widest text-[#8a9189]">
                <th className="px-5 py-4 font-bold sm:px-7">Destination</th>
                <th className="px-4 py-4 font-bold">Short link</th>
                <th className="px-4 py-4 font-bold">Created</th>
                <th className="px-4 py-4 font-bold">Visits</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-5 py-4 sm:px-7">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => {
                const expired =
                  url.expiresAt && new Date(url.expiresAt) < new Date();
                return (
                  <tr
                    key={url._id}
                    className="border-t border-[#eee8df] font-sans text-sm transition-colors hover:bg-[#faf5ed]"
                  >
                    <td className="max-w-[240px] px-5 py-5 sm:px-7">
                      <p
                        className="truncate font-semibold text-[#202523]"
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </p>
                      <p className="mt-1 text-xs text-[#92978f]">
                        Expires {formatDate(url.expiresAt)}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      <button
                        onClick={() => copy(url)}
                        className="group flex items-center gap-2 text-[#b6533d] hover:underline"
                      >
                        <span className="cursor-pointer">/{url.shortUrl}</span>
                        {copied === url._id ? (
                          <Check size={15} />
                        ) : (
                          <Copy
                            size={15}
                            className="opacity-50 group-hover:opacity-100"
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-5 text-[#788078]">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-4 py-5 font-semibold">
                      {(url.visitCount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold ${expired ? "text-[#9b5a4e]" : "text-[#52755c]"}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${expired ? "bg-[#b6533d]" : "bg-[#6c9a72]"}`}
                        />
                        {expired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-5 sm:px-7">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          title="Open short link"
                          href={shortLink(url.shortUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-2 text-[#788078] hover:bg-[#eee8df] hover:text-[#202523] cursor-pointer"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          title="Edit URL"
                          onClick={() => onEdit(url)}
                          className="rounded p-2 text-[#788078] hover:bg-[#eee8df] hover:text-[#b6533d] cursor-pointer"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          title="Delete URL"
                          onClick={() => setUrlToDelete(url)}
                          className="rounded p-2 text-[#788078] hover:bg-[#f6e5df] hover:text-[#b6533d] cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          title="More actions"
                          className="rounded p-2 text-[#788078] hover:bg-[#eee8df] cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {urlToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202523]/45 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setUrlToDelete(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-sm border border-[#ded6ca] bg-[#fffdf8] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-[#f6e5df] p-2 text-[#b6533d]">
                <AlertTriangle size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 id="delete-dialog-title" className="text-xl font-bold">
                  Delete this short link?
                </h2>
                <p id="delete-dialog-description" className="mt-2 font-sans text-sm leading-6 text-[#788078]">
                  This action cannot be undone. The link and its analytics will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setUrlToDelete(null)}
                className="outline-button cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={remove}
                className="ink-button bg-[#b6533d] hover:bg-[#963f2e] cursor-pointer"
              >
                Delete link
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default UrlsAnalytics;
