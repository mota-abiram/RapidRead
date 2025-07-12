import { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

// Utility function to estimate reading time (words/200 per min)
function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}

// Utility function to extract key points (split summary into sentences, pick top 3)
function extractKeyPoints(summary) {
  if (!summary) return [];
  // Split by sentence, filter out short ones, pick top 3
  const sentences = summary.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.filter(s => s.trim().length > 30).slice(0, 3);
}

function Demo() {
  const [article, setArticle] = useState({ url: "", summary: "" });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummery, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    // Clear history on every page load
    localStorage.removeItem("articles");
    setAllArticles([]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummery({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const clearHistory = () => {
    localStorage.removeItem("articles");
    setAllArticles([]);
    setArticle({ url: "", summary: "" });
  };

  return (
    <section className="w-full max-w-lg mt-16">
      <div className="flex flex-col w-full gap-2">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center justify-center"
        >
          <img
            src={linkIcon}
            alt="link icon"
            className="absolute left-0 w-5 my-2 ml-3"
          />
          <input
            type="url"
            placeholder="Enter a URL..."
            className="url_input peer dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-grey-700 peer-focus:text-gray-700 dark:border-gray-700 dark:text-white dark:bg-gray-800"
          >
            <p>↵</p>
          </button>
        </form>

        {/* Clear History Button */}
        {allArticles.length > 0 && (
          <button
            onClick={clearHistory}
            className="mt-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
          >
            Clear History
          </button>
        )}

        <div className="flex flex-col gap-1 overflow-y-auto max-h-60">
          {allArticles.map((article, i) => (
            <div
              className="link_card dark:bg-gray-800 dark:border-gray-700"
              key={i}
              onClick={() => setArticle(article)}
            >
              <div className="copy_btn" onClick={() => handleCopy(article.url)}>
                <img
                  src={copied === article.url ? tick : copy}
                  alt="copy btn"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 text-sm font-medium truncate font-satoshi text-secondary">
                {article.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center w-full my-10">
        {isFetching ? (
          <img src={loader} alt="loader" className="object-contain w-20 h-20" />
        ) : error ? (
          <p className="font-bold text-center text-black font-inter">
            Whoops! That was not supposed to happen :( <br />
            <span className="font-normal text-gray-700 font-satoshi">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-bold font-satoshi">
                Article <span className="blue_secondary_gradient">Summary</span>
              </h2>
              <div className="summary_box dark:bg-gray-800 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 font-inter dark:text-gray-200">
                  {article.summary}
                </p>
                {/* Reading time estimation */}
                <p className="mt-2 text-xs text-gray-500 font-satoshi dark:text-gray-400">
                  Estimated reading time: {estimateReadingTime(article.summary)} min
                </p>
                {/* Key points extraction */}
                <div className="mt-2">
                  <p className="font-semibold text-sm mb-1">Key Points:</p>
                  <ul className="list-disc ml-5 text-xs text-gray-700 dark:text-gray-200">
                    {extractKeyPoints(article.summary).map((point, idx) => (
                      <li key={idx}>{point.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Demo;
