
const Logo = () => {
  return (
    <div className="flex items-center gap-4 select-none">

      {/* Luxury Icon */}
      <div className="relative w-14 h-14 rounded-xl flex items-center justify-center">

        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          {/* G + Face Line Art */}
          <path
            d="
            M75 12
            C45 5 20 30 25 60
            C28 90 58 105 85 85

            M50 25
            C40 45 38 65 52 80

            M45 45
            C30 50 25 70 45 78

            M55 20
            C70 35 72 55 58 75
            "
            stroke="#161616"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* AI luxury sparkle */}
          <path
            d="
            M82 28
            L86 36
            L94 40
            L86 44
            L82 52
            L78 44
            L70 40
            L78 36
            Z
            "
            fill="#C7AE83"
          />

          {/* Home hidden mark */}
          <path
            d="
            M42 82
            L60 68
            L78 82
            M50 82
            V72
            H70
            V82
            "
            stroke="#C7AE83"
            strokeWidth="2"
            strokeLinecap="round"
          />

        </svg>

      </div>


      {/* Text */}
      <div className="flex flex-col">

        <div className="flex items-baseline gap-2">

          <h1
            className="
            font-serif
            text-4xl
            tracking-wide
            text-[#161616]
            "
          >
            GlamGo
          </h1>

          <span
            className="
            font-serif
            italic
            text-4xl
            text-[#C7AE83]
            "
          >
            AI
          </span>

        </div>


        {/* Tagline */}
        <div className="flex items-center gap-3 mt-1">

          <span className="w-10 h-[1px] bg-[#C7AE83]" />

          <p
            className="
            text-[9px]
            tracking-[0.35em]
            uppercase
            text-[#161616]
            "
          >
            Luxury Beauty, Intelligently At Home
          </p>

          <span className="w-10 h-[1px] bg-[#C7AE83]" />

        </div>

      </div>

    </div>
  );
};

export default Logo;
