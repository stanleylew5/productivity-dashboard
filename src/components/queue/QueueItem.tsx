import Image from "next/image";

type QueueItemProps = {
  albumUrl: string;
  songName: string;
  artist: string;
};

const QueueItem: React.FC<QueueItemProps> = ({ albumUrl, songName, artist }) => {
  return (
    <div className="flex flex-row items-center justify-center text-center">
      <Image
        src={albumUrl}
        alt="Album Cover"
        className="mb-4 rounded-lg"
        width={160}
        height={160}
      />
      <p className="text-md font-semibold">{songName}</p>
      <p className="text-xs text-gray-500">{artist}</p>
    </div>
  );
};

export default QueueItem;
