import React from "react";
import Image from "next/image";
import "../../assets/CSS/userAvatar.css"

interface UserAvatarProps {
  fullName: string;
  imageUrl?: string;
  size?: number;
  className?: string;
}

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);

  if (words.length === 0) return "?";

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  fullName,
  imageUrl,
  size = 60,
  className = "",
}) => {
  const initials = getInitials(fullName);

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={fullName}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={fullName}
      className={`user-avatar user-avatar--initials ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;