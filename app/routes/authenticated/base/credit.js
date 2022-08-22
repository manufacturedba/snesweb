import Route from '@ember/routing/route';

export default class CreditRoute extends Route {
  model() {
    return [
      {
        imageAlt: "Alec's face",
        image: '/credits/alec.jpg',
        title: 'Lead Artist',
        description:
          "Alec Asperslag makes art and sometimes other things. A piece of Alec's soul was once locked into a puppet (is it still there?). Alec lacks the ability to self-describe. Find Alec on twitter or ArtStation.",
        links: [
          'https://mobile.twitter.com/asperslaga',
          'https://www.artstation.com/alecasperslaga',
        ],
      },
      {
        imageAlt: "Kelsey's face",
        image: '/credits/kelsey.jpg',
        title: 'Artist',
        description:
          'Kelsey Clarke paints, draws, and makes ice cream.  Kelsey likes to surround herself with dumb, sentient things. Kelsey has two cats and a boyfriend who all live in a big, dumb apartment in San Francisco. Find Kelsey on Instagram.',
        links: ['https://www.instagram.com/kelseyclarkeart/'],
      },
      {
        imageAlt: "Roberto's face",
        image: '/credits/roberto.jpg',
        title: 'Programmer',
        description:
          'Roberto Rodriguez used to make pasta on the weekend. Some supermarkets have banned Roberto for sniffing the pineapples. Roberto would also like you to know he owns a Roomba, but perhaps for not much longer. Find Roberto at tumblr and his bad website.',
        links: [
          'https://tumblr.roberto-rodriguez.com',
          'https://roberto-rodriguez.com',
        ],
      },
    ];
  }
}
