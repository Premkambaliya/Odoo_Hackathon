import React from "react";

type Review = {
  name: string;
  skill: string;
  avatar: string;
  review: string;
};

const reviews: Review[] = [
  {
    name: "Arya Patel",
    skill: "React to UI/UX Design",
    avatar: "https://i.pravatar.cc/150?img=3",
    review: "SkillSwap helped me learn UI/UX while teaching React! The experience was smooth, and the feedback feature adds great trust."
  },
  {
    name: "Meera Shah",
    skill: "Cooking to English Speaking",
    avatar: "https://i.pravatar.cc/150?img=5",
    review: "Loved the skill-for-skill format! I got better at English while sharing cooking tips with someone passionate about food."
  },
  {
    name: "Raj Sinha",
    skill: "Photography to Coding",
    avatar: "https://i.pravatar.cc/150?img=10",
    review: "A great way to build mutual value. I taught photography and got hands-on help with JavaScript in return. Highly recommended!"
  }
];

const ReviewSection: React.FC = () => {
  return (
    <section className="bg-indigo-50 py-16 px-6 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        What Our Users Say
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {reviews.map((rev, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{rev.name}</h3>
                <p className="text-sm text-indigo-600">{rev.skill}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{rev.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;