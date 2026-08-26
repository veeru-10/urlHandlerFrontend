import { useEffect, useRef } from "react";
import { CalendarDays, Link2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createShortUrl, updateUrl } from "../store/stores/urlSlice";

const UrlComposer = ({ editingUrl, onClose }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.url.loading);
  const originalUrlInput = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: editingUrl?.originalUrl || "",
      expiresAt: editingUrl?.expiresAt
        ? new Date(editingUrl.expiresAt).toISOString().slice(0, 10)
        : "",
    },
  });
  const originalUrlRegistration = register("originalUrl", {
    required: "Paste a URL to continue",
    pattern: {
      value: /^https?:\/\/.+/,
      message: "Include http:// or https://",
    },
  });

  useEffect(() => {
    reset({
      originalUrl: editingUrl?.originalUrl || "",
      expiresAt: editingUrl?.expiresAt
        ? new Date(editingUrl.expiresAt).toISOString().slice(0, 10)
        : "",
    });
  }, [editingUrl, reset]);

  useEffect(() => {
    if (window.location.hash !== "#new-link") return undefined;
    const focusInput = () => {
      originalUrlInput.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      originalUrlInput.current?.focus();
    };
    const frameId = window.requestAnimationFrame(focusInput);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const submit = async (values) => {
    const action = editingUrl
      ? updateUrl({
          id: editingUrl._id,
          ...values,
          expiresAt: values.expiresAt || null,
        })
      : createShortUrl({ ...values, expiresAt: values.expiresAt || null });
    const result = await dispatch(action);
    if (!result.error) {
      reset();
      onClose?.();
    }
  };

  return (
    <section id="new-link" className="animate-rise rounded-sm border border-[#ded6ca] bg-[#fffdf8] p-5 shadow-[0_12px_35px_rgba(55,45,32,.06)] sm:p-7">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="eyebrow">
            {editingUrl ? "Edit destination" : "Create a short link"}
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {editingUrl
              ? "Refine this link"
              : "Give your URL a smaller footprint."}
          </h2>
        </div>
        {editingUrl && (
          <button
            title="Close editor"
            onClick={onClose}
            className="text-[#6d736e] hover:text-[#b6533d]"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end"
      >
        <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#687069]">
          Long URL
          <div className="relative mt-2">
            <Link2
              size={17}
              className="absolute left-3 top-3.5 text-[#b6533d]"
            />
            <input
              {...originalUrlRegistration}
              ref={(element) => {
                originalUrlRegistration.ref(element);
                originalUrlInput.current = element;
              }}
              className="field pl-10"
              placeholder="https://your-long-link.com/article"
            />
          </div>
          {errors.originalUrl && (
            <span className="mt-1 block font-sans text-xs text-[#b6533d]">
              {errors.originalUrl.message}
            </span>
          )}
        </label>
        <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#687069]">
          Expires on
          <div className="relative mt-2">
            <CalendarDays
              size={16}
              className="absolute left-3 top-3.5 text-[#b6533d]"
            />
            <input
              type="date"
              {...register("expiresAt")}
              className="field pl-10"
            />
          </div>
        </label>
        <button
          disabled={loading}
          className="ink-button disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Saving..." : editingUrl ? "Save changes" : "Shorten URL"}
        </button>
      </form>
    </section>
  );
};

export default UrlComposer;
