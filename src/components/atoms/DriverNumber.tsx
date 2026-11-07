export function DriverNumber({ value }: { value: string }) {
  return (
    <p className="driver-number" aria-label={`Número ${value}`}>
      {value}
    </p>
  );
}
