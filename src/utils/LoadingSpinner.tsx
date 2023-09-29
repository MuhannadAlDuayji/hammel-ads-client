import "./LoadingSpinner.css";

interface LoadingSpinnerProps {}

export default function LoadingSpinner({}: LoadingSpinnerProps) {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
        </div>
    );
}
