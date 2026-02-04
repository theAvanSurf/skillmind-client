type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
    />
  );
}
