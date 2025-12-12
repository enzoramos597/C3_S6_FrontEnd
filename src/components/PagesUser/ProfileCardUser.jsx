const ProfileCardUser = ({ name, avatar, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className='flex flex-col items-center cursor-pointer transition-transform hover:scale-105'
    >
      <img 
        src={avatar || "/default-avatar.png"}
        alt="profile"
        className='w-24 h-24 rounded-lg shadow-md'
      />
      <p className='mt-2 text-white text-sm font-semibold'>{name}</p>
    </div>
  );
};

export default ProfileCardUser;