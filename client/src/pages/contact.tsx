import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Instagram, Twitter, Mail, MapPin, User } from 'lucide-react';
import { ModernNavbar } from '@/components/ModernNavbar';

export default function Contact() {
  const creators = [
    {
      name: 'M KISHORE',
      role: 'Full Stack Developer & ML Engineer',
      avatarColor: 'from-primary to-blue-500',
      bio: 'Passionate about AI/ML and building innovative solutions for real-world problems.',
      links: {
        github: 'https://github.com/mkishore',
        linkedin: 'https://linkedin.com/in/mkishore',
        instagram: 'https://instagram.com/mkishore',
        twitter: 'https://twitter.com/mkishore',
        email: 'kishore@foodconnect.com'
      }
    },
    {
      name: 'CH V SNEHA',
      role: 'Frontend Developer & UI/UX Designer',
      avatarColor: 'from-secondary to-green-500',
      bio: 'Creative developer focused on user experience and modern web technologies.',
      links: {
        github: 'https://github.com/chvsneha',
        linkedin: 'https://linkedin.com/in/chvsneha',
        instagram: 'https://instagram.com/chvsneha',
        twitter: 'https://twitter.com/chvsneha',
        email: 'sneha@foodconnect.com'
      }
    }
  ];

  const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
      title={label}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the team behind FoodConnect. We're passionate about creating innovative solutions 
              that make food safety accessible to everyone.
            </p>
          </div>

          {/* Creators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {creators.map((creator, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${creator.avatarColor} flex items-center justify-center border-4 border-gray-100 shadow-lg`}>
                      <User className="text-white" size={48} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {creator.name}
                  </CardTitle>
                  <p className="text-blue-600 font-semibold">{creator.role}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-600 text-center">{creator.bio}</p>
                  
                  <div className="space-y-3">
                    <SocialLink
                      href={creator.links.email}
                      icon={<Mail size={18} />}
                      label="Email"
                    />
                    <SocialLink
                      href={creator.links.github}
                      icon={<Github size={18} />}
                      label="GitHub"
                    />
                    <SocialLink
                      href={creator.links.linkedin}
                      icon={<Linkedin size={18} />}
                      label="LinkedIn"
                    />
                    <SocialLink
                      href={creator.links.instagram}
                      icon={<Instagram size={18} />}
                      label="Instagram"
                    />
                    <SocialLink
                      href={creator.links.twitter}
                      icon={<Twitter size={18} />}
                      label="Twitter"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Information */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">About This Project</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700 text-lg">
                FoodConnect is a comprehensive machine learning research project focused on intelligent food safety assessment. 
                This platform combines cutting-edge AI technologies to provide personalized health insights and safety ratings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">6 Months</div>
                  <div className="text-gray-600">Development Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">5+</div>
                  <div className="text-gray-600">ML Algorithms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">18K+</div>
                  <div className="text-gray-600">Food Database Items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="text-blue-600 mr-3" size={24} />
                  Get In Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Have questions about FoodConnect or want to collaborate? We'd love to hear from you!
                </p>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <Mail size={16} className="mr-2" />
                    contact@foodconnect.com
                  </p>
                  <p className="flex items-center text-gray-700">
                    <MapPin size={16} className="mr-2" />
                    India
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  FoodConnect is an open-source project. Contributions, feedback, and suggestions are welcome!
                </p>
                <a
                  href="https://github.com/foodconnect/foodconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Github size={18} />
                  <span>View on GitHub</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}