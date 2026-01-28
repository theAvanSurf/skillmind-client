type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}
