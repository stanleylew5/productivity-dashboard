import Image from "next/image";

type QueueItemProps = {
  albumUrl: string;
  songName: string;
  artist: string;
};

const QueueItem: React.FC<QueueItemProps> = ({
  albumUrl,
  songName,
  artist,
}) => {
  return (
    <div className="mx-4 mt-4 grid grid-cols-4 items-center gap-3 rounded-xl bg-dash-black-100 px-[1vw]">
      <Image
        src={albumUrl}
        alt="Album Cover"
        className="my-[1vh] w-[6vh] rounded-lg"
        width={70}
        height={70}
      />
      <div className="col-span-3">
        <p className="text-[0.75vw] text-dash-orange-200">{songName}</p>
        <p className="row-span-3 text-[0.6vw] text-dash-orange-200">{artist}</p>
      </div>
    </div>
  );
};

export default QueueItem;
