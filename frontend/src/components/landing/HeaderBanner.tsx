import { type ReactNode } from 'react';
import { 
  ChevronRight,
  Star,
  Users,
  ShoppingBag,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import Banner from '../../assets/banner-4.png'

// Define interfaces and types
interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface StatItem {
  icon: ReactNode;
  value: string;
  label: string;
}

interface CTAButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

type BackgroundStyle = 'gradient' | 'image' | 'solid' | 'mesh';
type HeightOption = 'compact' | 'medium' | 'large' | 'hero';
type LayoutVariant = 'centered' | 'split' | 'minimal';

interface EcommerceHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundStyle?: BackgroundStyle;
  backgroundImage?: string;
  icon?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  stats?: StatItem[];
  ctaButtons?: CTAButton[];
  badge?: {
    text: string;
    variant?: 'new' | 'sale' | 'trending' | 'featured';
  };
  overlayOpacity?: number;
  height?: HeightOption;
  layout?: LayoutVariant;
  showDecorations?: boolean;
}

const EcommerceHeader: React.FC<EcommerceHeaderProps> = ({
  title,
  subtitle,
  description,
  backgroundStyle = 'gradient',
  backgroundImage = Banner,
  icon = null,
  breadcrumb = [],
  stats = [],
  ctaButtons = [],
  badge,
  overlayOpacity = 0.4,
  height = 'medium',
  layout = 'centered',
  showDecorations = true
}) => {
  const getBackgroundClasses = (): string => {
    switch (backgroundStyle) {
      case 'image':
        return 'bg-cover bg-center bg-no-repeat';
      case 'solid':
        return 'bg-slate-900';
      case 'mesh':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
      case 'gradient':
      default:
        return 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900';
    }
  };

  const getHeightClasses = (): string => {
    const heights: Record<HeightOption, string> = {
      'compact': 'min-h-[30vh] py-12 md:py-16', // Reduced from min-h-[40vh]
      'medium': 'min-h-[40vh] py-16 md:py-20', // Reduced from min-h-[50vh]
      'large': 'min-h-[50vh] py-20 md:py-28', // Reduced from min-h-[60vh]
      'hero': 'min-h-[60vh] py-24 md:py-32' // Reduced from min-h-[70vh]
    };
    return heights[height] || heights['medium'];
  };

  const getBadgeVariantClasses = (variant: string): string => {
    const variants: Record<string, string> = {
      'new': 'bg-emerald-500 text-white',
      'sale': 'bg-red-500 text-white',
      'trending': 'bg-orange-500 text-white',
      'featured': 'bg-purple-500 text-white'
    };
    return variants[variant] || variants['new'];
  };

  const getLayoutClasses = (): string => {
    const layouts: Record<LayoutVariant, string> = {
      'centered': 'text-center items-center',
      'split': 'text-left items-start lg:items-center',
      'minimal': 'text-center items-center'
    };
    return layouts[layout] || layouts['centered'];
  };

  const isLightBackground = backgroundStyle === 'mesh';

  return (
    <header 
      className={`relative overflow-hidden ${getHeightClasses()} ${getBackgroundClasses()}`}
      style={backgroundImage && backgroundStyle === 'image' ? { 
        backgroundImage: `linear-gradient(to right,rgba(15,23,42,${overlayOpacity}),rgba(15,23,42,${overlayOpacity})),url(${backgroundImage})` 
      } : {}}
    >
      
      {/* Decorative Elements */}
      {showDecorations && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
          <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-500"></div>
          <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
        </div>
      )}
      
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className={`h-full flex flex-col justify-center ${getLayoutClasses()}`}>
          
          {/* Breadcrumb Navigation */}
          {breadcrumb.length > 0 && (
            <nav className="mb-8 w-full">
              <ol className={`flex items-center space-x-2 text-sm ${layout === 'centered' ? 'justify-center' : ''}`}>
                {breadcrumb.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {item.active ? (
                      <span className={`${isLightBackground ? 'text-slate-600' : 'text-slate-300'} font-medium`}>
                        {item.label}
                      </span>
                    ) : (
                      <Link 
                        to={item.href || '#'}
                        className={`${isLightBackground ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors duration-200`}
                      >
                        {item.label}
                      </Link>
                    )}
                    {index < breadcrumb.length - 1 && (
                      <ChevronRight className={`w-4 h-4 mx-2 ${isLightBackground ? 'text-slate-400' : 'text-slate-400'}`} />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Main Content */}
          <div className={`${layout === 'split' ? 'grid lg:grid-cols-2 gap-12 items-center w-full' : 'max-w-lg'}`}>
            
            {/* Left Column / Main Content */}
            <div className={layout === 'split' ? 'text-left' : ''}>
              
              {/* Badge */}
              {badge && (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 ${getBadgeVariantClasses(badge.variant || 'new')}`}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {badge.text}
                </div>
              )}

              {/* Icon */}
              {icon && (
                <div className="mb-2 -mt-8">
                  <div className={`${isLightBackground ? 'bg-white shadow-xl' : 'bg-white/10 backdrop-blur-lg border border-white/20'} rounded-lg w-20 h-14 flex items-center justify-center ${layout === 'centered' ? 'mx-auto' : ''}`}>
                    <div className={`${isLightBackground ? 'text-slate-700' : 'text-white'}`}>
                      {icon}
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <h1 className={`text-lg md:text-lg lg:text-4xl font-bold mb-6 leading-tight ${isLightBackground ? 'text-slate-900' : 'text-white'}`}>
                {layout === 'minimal' ? (
                  <span className={isLightBackground ? 'bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent' : 'bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent'}>
                    {title}
                  </span>
                ) : (
                  title
                )}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className={`text-xl md:text-lg font-medium mb-6 ${isLightBackground ? 'text-slate-600' : 'text-blue-100'}`}>
                  {subtitle}
                </p>
              )}

              {/* Description */}
              {description && (
                <p className={`text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg ${layout === 'centered' ? 'mx-auto' : ''} ${isLightBackground ? 'text-slate-600' : 'text-slate-300'}`}>
                  {description}
                </p>
              )}

              {/* CTA Buttons */}
              {ctaButtons.length > 0 && (
                <div className={`flex flex-col sm:flex-row gap-4 mb-10 ${layout === 'centered' ? 'justify-center' : ''}`}>
                  {ctaButtons.map((button, index) => (
                    <Link
                      key={index}
                      to={button.href}
                      className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                        button.variant === 'secondary' 
                          ? `${isLightBackground ? 'bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-50' : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 backdrop-blur-sm'}`
                          : `${isLightBackground ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}`
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      {button.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column / Stats */}
            {layout === 'split' && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg ${isLightBackground ? 'bg-white shadow-lg' : 'bg-white/10 backdrop-blur-lg border border-white/20'}`}
                  >
                    <div className={`flex items-center mb-3 ${isLightBackground ? 'text-slate-700' : 'text-white'}`}>
                      {stat.icon}
                    </div>
                    <div className={`text-lg font-bold mb-1 ${isLightBackground ? 'text-slate-900' : 'text-white'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${isLightBackground ? 'text-slate-600' : 'text-slate-300'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Stats (for centered/minimal layouts) */}
          {(layout === 'centered' || layout === 'minimal') && stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-lg w-full">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 rounded-lg ${isLightBackground ? 'bg-white shadow-lg' : 'bg-white/10 backdrop-blur-lg border border-white/20'}`}
                >
                  <div className={`flex justify-center mb-3 ${isLightBackground ? 'text-slate-700' : 'text-white'}`}>
                    {stat.icon}
                  </div>
                  <div className={`text-lg md:text-lg font-bold mb-1 ${isLightBackground ? 'text-slate-900' : 'text-white'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isLightBackground ? 'text-slate-600' : 'text-slate-300'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>
    </header>
  );
};

// Example usage with e-commerce data
const ExampleUsage = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: 'Electronics', active: true }
  ];

  const statsData = [
    { icon: <Star className="w-6 h-6" />, value: '4.9', label: 'Rating' },
    { icon: <Users className="w-6 h-6" />, value: '50K+', label: 'Customers' },
    { icon: <ShoppingBag className="w-6 h-6" />, value: '1M+', label: 'Products' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '99%', label: 'Satisfaction' }
  ];

  const ctaButtons = [
    { text: 'Shop Now', href: '/shop', variant: 'primary' as const },
    { text: 'View Catalog', href: '/catalog', variant: 'secondary' as const }
  ];

  return (
    <EcommerceHeader
      title="Premium Electronics"
      subtitle="Discover cutting-edge technology"
      description="Transform your digital lifestyle with our curated collection of premium electronics, featuring the latest innovations from top brands worldwide."
      backgroundStyle="gradient"
      breadcrumb={breadcrumbItems}
      stats={statsData}
      ctaButtons={ctaButtons}
      badge={{ text: 'New Collection', variant: 'new' }}
      height="compact" // Using reduced height
      layout="split"
      icon={<ShoppingBag className="w-8 h-8" />}
    />
  );
};

export default EcommerceHeader;