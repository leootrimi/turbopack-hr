export interface Activity {
  id: number;
  type: "discussion" | "status" | "listing";
  title: string;
  time: string;

  // optional fields depending on the type
  subtitle?: string;
  description?: string;

  status?: string;
  avatars?: string[];

  price?: string;
  duration?: string;
  link?: string;
  image?: string;
}

 
 export const activityData:  Activity[] = [
    {
      id: 1,
      type: 'discussion',
      title: 'Responded 2 discussion in 1 Property',
      subtitle: 'Aspr.com/bit.98fj8...',
      time: '24 August, 19:31',
      description: 'In order for a person (legal or natural) to sell property in CA the land, building or both should meet a series of conditions such as: the ...'
    },
    {
      id: 2,
      type: 'status',
      title: 'Seller list August 2024',
      status: 'Shortlisted',
      time: '24 August, 19:31',
      avatars: ['/api/placeholder/32/32', '/api/placeholder/32/32']
    },
    {
      id: 3,
      type: 'status',
      title: 'Seller list August 2024',
      status: 'Done',
      time: '24 August, 19:31',
      avatars: ['/api/placeholder/32/32', '/api/placeholder/32/32']
    },
    {
      id: 4,
      type: 'listing',
      title: 'New Listing at 900 Jessie Street, SF',
      price: '$2,585,000',
      duration: 'Ends in 10 days',
      link: 'tinyurl.com/4mbpjmn3',
      time: '24 August, 19:31',
      image: '/api/placeholder/80/60'
    }
  ];