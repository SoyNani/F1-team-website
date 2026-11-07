import Image from "next/image";
import type { DriverPhotoData } from "@/data/teams";

export function DriverPhoto({ photo, alt }: { photo: DriverPhotoData; alt: string }) {
  return (
    <figure className="driver-photo">
      <Image src={photo.src} alt={alt} width={640} height={800} sizes="(max-width: 768px) 60vw, 24vw" />
      <figcaption>
        {photo.author} · {photo.license}
      </figcaption>
    </figure>
  );
}
