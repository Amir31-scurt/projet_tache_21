import React from 'react';
import Card from '../outils/cards_reusable';

export default function Cards() {
  const programs = [
    {
      title: 'UX/UI Design',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    {
      title: 'Bureautique',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    {
      title: 'Programmation',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    {
      title: 'Marketing Digital',
      description:
        'Learn the principles of user experience and user interface design.',
      imageUrl:
        'https://www.appsdevpro.com/blog/wp-content/uploads/2022/06/Ui-ux-cover-imge.jpg',
      buttonText: 'Commencer à apprendre',
    },
    // ...other programs
  ];
  return (
    <div className="d-flex flex-wrap justify-content-center">
      {programs.map((program, index) => (
        <div
          className="d-flex flex-wrap gap-2  justify-content-center"
          key={index}
        >
          <Card
            title={program.title}
            description={program.description}
            imageUrl={program.imageUrl}
            buttonText={program.buttonText}
          />
        </div>
      ))}
    </div>
  );
}
