import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSkillSwap } from '@/contexts/SkillSwapContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SkillList } from '@/components/skills/SkillList';
import { SwapRequestModal } from '@/components/swaps/SwapRequestModal';
import { User, Skill } from '@/types';
import { StarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { getUserById, getUserRating } = useSkillSwap();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  useEffect(() => {
    if (id) {
      const user = getUserById(id);
      setProfileUser(user || null);
    }
    setIsLoading(false);
  }, [id, getUserById]);
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-16 text-center">
        Loading profile...
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="container max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground mt-2">
          The user you're looking for doesn't exist or has set their profile to private.
        </p>
        <Button className="mt-6" onClick={() => navigate('/browse')}>
          Back to Browse
        </Button>
      </div>
    );
  }
  
  // Don't allow viewing private profiles unless it's the current user or admin
  if (!profileUser.isPublic && 
      (!currentUser || (currentUser.id !== profileUser.id && currentUser.role !== 'admin'))) {
    return (
      <div className="container max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">Private Profile</h1>
        <p className="text-muted-foreground mt-2">
          This user has set their profile to private.
        </p>
        <Button className="mt-6" onClick={() => navigate('/browse')}>
          Back to Browse
        </Button>
      </div>
    );
  }
  
  const handleRequestSwap = (user: User, skill: Skill) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setSelectedSkill(skill);
    setSwapModalOpen(true);
  };
  
  const userRating = getUserRating(profileUser.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl py-8 px-4"
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileUser.photoUrl} />
            <AvatarFallback className="text-2xl">{profileUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <CardTitle className="text-2xl font-bold">{profileUser.name}</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              {profileUser.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              
              {userRating > 0 && (
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{userRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          
          {currentUser && currentUser.id === profileUser.id && (
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <ClockIcon className="h-4 w-4" />
              <span>Available:</span>
            </div>
            
            {profileUser.availability.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileUser.availability.map(time => (
                  <Badge key={time} variant="outline">{time}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No availability specified</p>
            )}
          </div>
          
          <Tabs defaultValue="offers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="offers">Skills Offered</TabsTrigger>
              <TabsTrigger value="wanted">Skills Wanted</TabsTrigger>
            </TabsList>
            
            <TabsContent value="offers" className="py-4">
              <SkillList
                skills={profileUser.skillsOffered}
                user={profileUser}
                type="offered"
                onRequestSwap={handleRequestSwap}
              />
            </TabsContent>
            
            <TabsContent value="wanted" className="py-4">
              <SkillList
                skills={profileUser.skillsWanted}
                user={profileUser}
                type="wanted"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedSkill && (
        <SwapRequestModal
          provider={profileUser}
          providerSkill={selectedSkill}
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
        />
      )}
    </motion.div>
  );
}