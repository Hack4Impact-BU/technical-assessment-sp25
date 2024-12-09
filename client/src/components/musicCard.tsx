interface cardProps {
  name: string;
  artist: string;
  link: string;
  imageLink: string;
}

const MusicCard = ({ name, artist, link, imageLink }: cardProps) => {
  return (
      <div className="max-w-md max-h-72p-4 relative transition duration-500 hover:scale-105 rounded-lg cursor-pointer">
        <a href={link} target="_blank">
          <div className="flex justify-center items-center">
              <img
                  className="rounded-lg w-[300px] h-[300px]"
                  src={imageLink}
                  alt={name}
                />
            </div>
            <div className="mt-2 text-center">
              <h1 className="text-xl font-bold">{name}</h1>
              <p className="text-xl font-bold">By: {artist}</p>
            </div>
        </a>
      </div>
  );
};

export default MusicCard;
