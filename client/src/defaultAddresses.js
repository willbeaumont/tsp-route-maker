const defaultAddresses = [
  {
    id: "1",
    name: "Google",
    address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043",
  },
  {
    id: "2",
    name: "Amazon",
    address: "1100 Enterprise Way, Sunnyvale, CA 94089",
  },
  {
    id: "3",
    name: "Microsoft",
    address: "1045 La Avenida St, Mountain View, CA 94043",
  },
  {
    id: "4",
    name: "LinkedIn",
    address: "800 E Middlefield Rd, Sunnyvale, CA 94085",
  },
  {
    id: "5",
    name: "Twitter",
    address: "1355 Market St #900, San Francisco, CA 94103",
  },
  {
    id: "6",
    name: "Meta",
    address: "1 Hacker Way, Menlo Park, CA 94025",
  },
  {
    id: "7",
    name: "Apple",
    address: "One Apple Park Way, Cupertino, CA 95014",
  },
  {
    id: "8",
    name: "H20.ai",
    address: "H2O.ai, Leghorn Street, Mountain View, CA",
  },
  {
    id: "9",
    name: "Rhumbix",
    address: "3515 Mt Diablo Blvd, Lafayette, CA 94549",
  },
  {
    id: "0",
    name: "Uber",
    address: "1455 Market St. Ste 400, San Francisco, CA 94103",
  },
];

const defaultEmbed = [
  "https://www.google.com/maps/embed?pb=!1m76!1m12!1m3!1d404547.16963732603!2d-122.48798930738577!3d37.61334233220765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m61!3e6!4m5!1s0x808fba027f087f8f%3A0xd86b06710e8fcc35!2sGoogle%20Building%2040%2C%201600%20Amphitheatre%20Pkwy%2C%20Mountain%20View%2C%20CA%2094043!3m2!1d37.422387799999996!2d-122.0841877!4m5!1s0x8085815c67b3754d%3A0xe1469f26aec0b147!2s1355%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103!3m2!1d37.776651099999995!2d-122.41678789999999!4m5!1s0x8085624537c9e4ef%3A0x644f757dc1d7edec!2s3515%20Mt%20Diablo%20Blvd%2C%20Lafayette%2C%20CA%2094549!3m2!1d37.8918181!2d-122.1172493!4m5!1s0x808fbc9721547991%3A0x29bfe9fcf99fdcd!2s1%20Hacker%20Way%2C%20Menlo%20Park%2C%20CA%2094025!3m2!1d37.484451!2d-122.1477997!4m5!1s0x808fb751e452af05%3A0xeb47b7316b359668!2sH2O.ai%2C%202307%20Leghorn%20St%2C%20Mountain%20View%2C%20CA%2094043!3m2!1d37.4188603!2d-122.0955681!4m5!1s0x808fb7a05c0f4991%3A0xe27696f66912199f!2s1100%20Enterprise%20Way%2C%20Sunnyvale%2C%20CA%2094089!3m2!1d37.408474999999996!2d-122.0364207!4m5!1s0x808fb702f9b47b33%3A0x59209145ad063577!2s800%20E%20Middlefield%20Rd%2C%20Sunnyvale%2C%20CA%2094085!3m2!1d37.390154599999995!2d-122.0468994!4m5!1s0x808fb596e9e188fd%3A0x3b0d8391510688f0!2sApple%20Park%2C%20One%20Apple%20Park%20Way%2C%20Cupertino%2C%20CA%2095014!3m2!1d37.334643799999995!2d-122.008972!4m5!1s0x808fb75ac384e14d%3A0xfd1c21de4c80e70b!2sMicrosoft%20SVC%20Building%204%2C%201045%20La%20Avenida%20St%2C%20Mountain%20View%2C%20CA%2094043!3m2!1d37.4107333!2d-122.0701716!4m5!1s0x808fba027f087f8f%3A0xd86b06710e8fcc35!2sGoogle%20Building%2040%2C%201600%20Amphitheatre%20Pkwy%2C%20Mountain%20View%2C%20CA%2094043!3m2!1d37.422387799999996!2d-122.0841877!5e0!3m2!1sen!2sus!4v1667536260860!5m2!1sen!2sus",
  "https://www.google.com/maps/dir/Google+Building+40,+1600+Amphitheatre+Pkwy,+Mountain+View,+CA+94043/1355+Market+St,+San+Francisco,+CA+94103/3515+Mt+Diablo+Blvd,+Lafayette,+CA+94549/1+Hacker+Way,+Menlo+Park,+CA+94025/H2O.ai,+2307+Leghorn+St,+Mountain+View,+CA+94043/1100+Enterprise+Way,+Sunnyvale,+CA+94089/800+E+Middlefield+Rd,+Sunnyvale,+CA+94085/Apple+Park,+One+Apple+Park+Way,+Cupertino,+CA+95014/Microsoft+SVC+Building+4,+1045+La+Avenida+St,+Mountain+View,+CA+94043/Google+Building+40,+1600+Amphitheatre+Pkwy,+Mountain+View,+CA+94043/@37.6136735,-122.2078032,10z/data=!4m32!4m31!1m2!1m1!1s0x808fba027f087f8f:0xd86b06710e8fcc35!1m2!1m1!1s0x8085815c67b3754d:0xe1469f26aec0b147!1m2!1m1!1s0x8085624537c9e4ef:0x644f757dc1d7edec!1m2!1m1!1s0x808fbd00e95f08c9:0x97cf258e1ae71ca0!1m2!1m1!1s0x808fb751e452af05:0xeb47b7316b359668!1m2!1m1!1s0x808fb7a05c0f4991:0xe27696f66912199f!1m2!1m1!1s0x808fb702f9b47b33:0x59209145ad063577!1m2!1m1!1s0x808fb596e9e188fd:0x3b0d8391510688f0!1m2!1m1!1s0x808fb75ac384e14d:0xfd1c21de4c80e70b!1m2!1m1!1s0x808fba027f087f8f:0xd86b06710e8fcc35!3e0?hl=en&gl=US",
];

export { defaultAddresses, defaultEmbed };
