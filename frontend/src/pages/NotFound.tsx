import { useNavigate } from "react-router-dom";
import "./NotFound.css";

type Props = {
  pageName?: string;
};

export default function NotFound({ pageName }: Props) {
  const navigate = useNavigate();

  return (
    <div className="nf-page">
      <div className="nf-card">
        <div className="nf-code">404</div>
        <div className="nf-divider" />
        <div className="nf-body">
          <h1 className="nf-title">
            {pageName ? `${pageName} isn't ready yet` : "Page not found"}
          </h1>
          <p className="nf-desc">
            {pageName
              ? `The ${pageName} section is currently under construction. Check back soon.`
              : "The page you're looking for doesn't exist or has been moved."}
          </p>
          <button className="nf-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
