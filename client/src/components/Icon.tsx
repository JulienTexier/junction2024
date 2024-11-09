export default function Icon({
  svg,
  color,
  style,
}: {
  svg: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        color,
        ...style,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
