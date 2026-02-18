export default function Ping() {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-1">
        <span className="flex size-2.75">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex size-2.75 rounded-full"></span>
        </span>
      </div>
    </div>
  );
}
