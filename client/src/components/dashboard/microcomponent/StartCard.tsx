type StatCardProps = {
  title: string;
  value: string | number;
  isAlert?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  isAlert = false,
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
      {title}
    </h3>
    <p
      className={`text-3xl font-bold mt-2 ${isAlert ? "text-black" : "text-green-700"}`}
    >
      {value}
    </p>
  </div>
);
