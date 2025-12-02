export default function LoadingPage() {
  return (
    <main className="flex flex-col items-center justify-center text-center bg-white text-gray-900 p-8">
      <h1 className="mb-2 text-5xl font-extralight text-[#2dd4cf]">
        Welcome to <span className="bg-[#2dd4cf] text-white px-2 rounded-lg font-medium">Hosti</span>!
      </h1>

      <p className="opacity-85">Your project is loading</p>

      <div className="relative my-20">
        <svg
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 187.3 93.7"
          width="300"
          height="200"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Animated stroke */}
          <path
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1
              c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
            stroke="#2dd4cf"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-svg-stroke"
          />

          {/* Background outline */}
          <path
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1
              c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
            stroke="#2dd4cf"
            strokeWidth="4"
            fill="none"
            opacity="0.05"
          />
        </svg>
      </div>

      <p className="text-gray-500 opacity-35 leading-6">
        This may take a few seconds. <br />
        The projects will apper when it's ready.
      </p>
    </main>
  );
}
