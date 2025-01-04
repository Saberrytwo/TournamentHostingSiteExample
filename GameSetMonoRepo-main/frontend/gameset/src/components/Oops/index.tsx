import "./index.css";

export const Oops = () => {
  return (
    <div className="oops bg-primary-blue">
      <img src="/icons/whistle.png"></img>
      <h1 className="text-white mt-4">Page Out of Bounds</h1>
      <div className="text-white mx-3 text-center w-75">
        Whoops! This page has ventured out of bounds. Let's get it back on the court and in play!
      </div>
      <div className="pb-5 mb-5"></div>
    </div>
  );
};
