const sampleData = 
{
	events: 
	[
		{
			id: '1',
			title: 'Trip to Empire State building',
			// date: '2020-05-17 21:09',
			date: '2020-05-17T21:09:00',
			category: 'culture',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
			city: 'NY, USA',
			venue: 'Empire State Building, 5th Avenue, New York, NY, USA',
			venueLatLng: 
			{
				lat: 40.7484405,
				lng: -73.98566440000002
			},
			hostedBy: 'Gunjan',
			hostPhotoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
			attendees: 
			[
				{
					id: 'a',
					name: 'Bob',
					photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
				},
				{
					id: 'b',
					name: 'Tom',
					photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
				}
			]
		},

		{
			id: '2',
			title: 'Trip to Punch and Judy Pub',
			date: '2020-08-12T07:54:00',
			category: 'drinks',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
			city: 'London, UK',
			venue: 'Punch & Judy, Henrietta Street, London, UK',
			venueLatLng: 
			{
				lat: 51.5118074,
				lng: -0.12300089999996544
			},
			hostedBy: 'Emilia',
			hostPhotoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
			attendees:
			[
				{
					id: 'a',
					name: 'Bob',
					photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
				},
				{
					id: 'b',
					name: 'Tom',
					photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
				}
			]
		}
	]
};

export default sampleData;