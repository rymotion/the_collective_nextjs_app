"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { getProject } from "@/data/mockData";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

interface Project {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  imageUrl: string;
  goal: number;
  raised: number;
  genre: string;
}

export default function FundProjectPage({ params: paramsPromise }: PageProps) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSupabaseAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [params, setParams] = useState<{ id: string; locale: string } | null>(
    null
  );

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!loading && !isAuthenticated && params) {
      router.push(`/${params.locale}/auth/signin?redirect=/fund/${params.id}`);
    }
  }, [isAuthenticated, loading, router, params]);

  useEffect(() => {
    if (params?.id) {
      getProject(params.id).then((data) => {
        if (data) {
          setProject(data);
        } else {
          router.push(`/${params.locale}`);
        }
      });
    }
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(
        `Successfully pledged $${parseFloat(amount).toFixed(2)} to ${
          project?.title
        }!`
      );

      if (params) {
        router.push(`/${params.locale}/projects/${params.id}`);
      }
    } catch (error) {
      console.error("Error submitting contribution:", error);
      alert("Failed to process contribution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !params) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const progress = Math.min((project.raised / project.goal) * 100, 100);

  return (
    <div className="w-full page-content">
      <div className="container-narrow">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-muted hover:text-primary transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Project
          </button>
        </div>

        <div className="glass-panel p-8 mb-8">
          <h1 className="text-h1 mb-2">Fund This Project</h1>
          <p className="text-subtitle text-muted">
            Support independent filmmaking by contributing to this project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel p-8">
              <h2 className="text-h2 mb-6">Contribution Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-bold mb-2"
                  >
                    Contribution Amount (USD)
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted pointer-events-none"
                      aria-hidden="true"
                    >
                      $
                    </span>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-white/10 rounded-lg text-2xl font-bold text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                      required
                      aria-label="Contribution amount in USD"
                    />
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Minimum contribution: $1.00
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50, 100, 250, 500].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value.toString())}
                      className="btn btn-outline text-sm py-2 px-4"
                    >
                      ${value}
                    </button>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold mb-2"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a message of support for the filmmaker..."
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted mt-2 text-right">
                    {message.length}/500 characters
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !amount || parseFloat(amount) <= 0
                    }
                    className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Contribute $${
                        amount ? parseFloat(amount).toFixed(2) : "0.00"
                      }`
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-panel p-6 mt-6">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-primary shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <div className="text-sm text-muted">
                  <p className="font-bold text-foreground mb-1">
                    Secure Payment
                  </p>
                  <p>
                    Your contribution is securely processed. Funds will only be
                    released to the filmmaker if the project reaches its funding
                    goal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel p-6 sticky top-[calc(200px+24px)]">
              <h3 className="text-h3 mb-4">Project Summary</h3>

              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="text-xl font-bold mb-1">{project.title}</h4>
              <p className="text-sm text-muted mb-4">
                by{" "}
                {typeof (project as any).author === "string"
                  ? (project as any).author
                  : (project as any).author?.display_name || "Anonymous"}
              </p>

              <div className="mb-4">
                <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full border border-primary/20 uppercase tracking-wider">
                  {project.genre}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted leading-relaxed line-clamp-4">
                  {project.synopsis}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Raised</span>
                  <span className="font-bold text-primary">
                    ${project.raised.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Goal</span>
                  <span className="font-bold">
                    ${project.goal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Progress</span>
                  <span className="font-bold text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
