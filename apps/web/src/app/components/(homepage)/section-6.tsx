interface BentoItem {
  id: number;
  title: string;
  description: string;
  bentoClassName: string;
}

const bentoItems: BentoItem[] = [
  {
    id: 1,
    title: "Automated evidence collection and cloud tests",
    description:
      "Access your information security program and controls, track, monitor and access risks, and manage your vendors, all from one platform.",
    bentoClassName: "col-span-2 lg:border-r border-border/5 border-b",
  },
  {
    id: 2,
    title: "Support for every framework you need",
    description:
      "One platform for frameworks like SOC 2, ISO 27001, and GDPR—streamlined compliance, automated with AI & integrations.",
    bentoClassName: "col-span-2 lg:border-r border-border/5 border-b",
  },
  {
    id: 3,
    title: "Make compliance simple and straightforward",
    description:
      "Automated evidence gathering keeps you compliant, while real-time monitoring catches gaps before they become problems.",
    bentoClassName: "col-span-2 border-border/5 border-b",
  },
];

export function Section6() {
  return (
    <section className="relative grid gap-16 md:gap-24 py-20 px-10 md:px-6 border-b border-border/5">
      <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col items-center justify-center">
        <p className="bg-[#00DC73B2]/10 mb-6 font-mono uppercase text-[#00DC73] text-sm h-8 px-3 border-l-2 border-[#00DC73] flex items-center gap-2">
          Built for scale
        </p>
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-balance text-center text-white">
            Scalable compliance for startups and enterprises
          </h1>
          <p className="text-base md:text-lg text-center text-[#E1E1E1]/70 max-w-xl mx-auto text-balance leading-relaxed tracking-tight">
            Whether you&apos;re a startup preparing for your first SOC 2 audit
            or an enterprise managing multiple frameworks across subsidiaries,
            our platform grows with you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 text-white overflow-hidden max-w-6xl mx-auto border rounded-2xl border-[#26272B]">
        {bentoItems.map((item) => (
          <div key={item.id} className={`${item.bentoClassName}`}>
            <div className="p-4 relative z-20 min-h-[150px] grid items-end justify-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="47"
                  height="46"
                  viewBox="0 0 47 46"
                  fill="none"
                  className="size-8"
                >
                  <path
                    opacity="0.2"
                    d="M32.292 23C32.292 24.7059 31.7861 26.3734 30.8384 27.7918C29.8907 29.2102 28.5437 30.3157 26.9676 30.9685C25.3916 31.6213 23.6574 31.7921 21.9843 31.4593C20.3113 31.1265 18.7744 30.305 17.5682 29.0988C16.362 27.8926 15.5405 26.3557 15.2077 24.6827C14.8749 23.0096 15.0457 21.2754 15.6985 19.6994C16.3513 18.1233 17.4568 16.7763 18.8752 15.8286C20.2936 14.8808 21.9611 14.375 23.667 14.375C25.9545 14.375 28.1483 15.2837 29.7658 16.9012C31.3833 18.5187 32.292 20.7125 32.292 23Z"
                    fill="#00DC73"
                  />
                  <path
                    d="M40.5353 14.9433C42.53 19.1153 42.9087 23.8783 41.5982 28.313C40.2877 32.7478 37.381 36.54 33.439 38.9576C29.4969 41.3752 24.7991 42.247 20.2521 41.4046C15.7051 40.5622 11.6314 38.0654 8.81706 34.396C6.00274 30.7267 4.64738 26.1449 5.01255 21.535C5.37772 16.9251 7.43754 12.6139 10.7945 9.43335C14.1514 6.25284 18.5675 4.42854 23.1903 4.31253C27.8132 4.19652 32.3152 5.79703 35.8275 8.80516L39.901 4.72985C40.1707 4.46011 40.5366 4.30858 40.918 4.30858C41.2995 4.30858 41.6653 4.46011 41.935 4.72985C42.2048 4.99958 42.3563 5.36542 42.3563 5.74688C42.3563 6.12834 42.2048 6.49417 41.935 6.76391L24.685 24.0139C24.4153 24.2836 24.0495 24.4352 23.668 24.4352C23.2866 24.4352 22.9207 24.2836 22.651 24.0139C22.3813 23.7442 22.2297 23.3783 22.2297 22.9969C22.2297 22.6154 22.3813 22.2496 22.651 21.9798L27.6319 16.9989C26.282 16.1061 24.6703 15.6951 23.0577 15.8323C21.4452 15.9695 19.9261 16.6469 18.7464 17.7549C17.5667 18.8629 16.7955 20.3366 16.5576 21.9374C16.3197 23.5382 16.6291 25.1725 17.4356 26.5756C18.2421 27.9788 19.4985 29.0687 21.0015 29.6689C22.5046 30.2691 24.1661 30.3444 25.7173 29.8828C27.2685 29.4211 28.6184 28.4495 29.5487 27.1251C30.4789 25.8007 30.9349 24.2012 30.8429 22.5854C30.8323 22.3966 30.859 22.2076 30.9214 22.0291C30.9838 21.8507 31.0808 21.6862 31.2068 21.5452C31.3328 21.4043 31.4853 21.2895 31.6556 21.2074C31.826 21.1253 32.0108 21.0777 32.1996 21.067C32.5808 21.0456 32.955 21.1765 33.2397 21.4309C33.3807 21.5569 33.4955 21.7094 33.5776 21.8797C33.6596 22.0501 33.7073 22.2349 33.7179 22.4237C33.849 24.7107 33.1958 26.974 31.8662 28.8395C30.5367 30.7049 28.6105 32.0609 26.4058 32.6833C24.2012 33.3057 21.8503 33.1572 19.7415 32.2625C17.6327 31.3677 15.8923 29.7801 14.808 27.7622C13.7237 25.7443 13.3604 23.4168 13.7781 21.1645C14.1958 18.9121 15.3696 16.8697 17.1054 15.3748C18.8411 13.8799 21.035 13.0219 23.3244 12.9428C25.6138 12.8637 27.8617 13.5682 29.6965 14.9397L33.7844 10.8518C30.7887 8.36456 26.9796 7.07182 23.0888 7.22189C19.198 7.37195 15.4998 8.95423 12.7045 11.6648C9.90926 14.3754 8.214 18.0232 7.94436 21.9075C7.67471 25.7919 8.84969 29.6389 11.2436 32.7097C13.6376 35.7806 17.0817 37.8586 20.9144 38.5449C24.7472 39.2311 28.6983 38.4771 32.009 36.4276C35.3197 34.3781 37.7564 31.1778 38.8512 27.4412C39.9461 23.7045 39.6218 19.6952 37.9406 16.1831C37.7762 15.839 37.7552 15.4438 37.8822 15.0842C38.0093 14.7246 38.2739 14.4303 38.618 14.2659C38.9621 14.1014 39.3574 14.0805 39.7169 14.2075C40.0765 14.3345 40.3709 14.5992 40.5353 14.9433Z"
                    fill="#00DC73"
                  />
                </svg>
                <h2 className="mt-2 max-w-xl mx-auto text-center text-balance leading-relaxed tracking-tight">
                  {item.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
