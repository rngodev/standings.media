import { useParams } from "react-router";

export default function Take() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">Take: {slug}</h1>
    </div>
  );
}
