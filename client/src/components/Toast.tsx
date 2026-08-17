export default function Toast({ msg, em }: { msg: string; em: string }) {
  return (
    <div className="toast show">
      <span className="em">{em}</span>
      <span>{msg}</span>
    </div>
  );
}
