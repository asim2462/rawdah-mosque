export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-2 gap-1 mt-4" style={{ fontFamily: 'avenir-next-demi-bold' }}>
      <p className="text-center max-w-5xl mx-auto whitespace-normal lg:whitespace-nowrap text-[#ffffff]">
        The fajr time is based on the ISNA angle degree rule. The isha time is based on the 15 degree rule.
      </p>
      <p className="text-center max-w-5xl mx-auto whitespace-normal lg:whitespace-nowrap text-[#bf9743]">
        GREENSVILLE TRUST MUSTAFA MOUNT: EMM LANE CAMPUS. EMM LANE BRADFORD, BD9 4JL
      </p>
      <div className="flex items-center justify-center my-4">
        <img
          src="/rawdah_mosque_logo.png"
          alt="Rawdah Mosque Logo"
          width="215"
          style={{
            //maxWidth: '50%',
            //maxHeight: '20%',
            display: 'block',
            margin: '0 auto'
          }}
          draggable="false"
        />
      </div>
    </footer>
  );
}
