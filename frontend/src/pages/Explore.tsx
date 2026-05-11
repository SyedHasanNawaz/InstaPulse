import { 
  Compass, 
  Search, 
  Play, 
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const Explore = () => {
  const items = [
    { id: 1, type: 'video', size: 'large', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80', views: '125k', color: 'from-purple-500 to-indigo-600' },
    { id: 2, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ef4?w=400&q=80', likes: '1.2k', color: 'from-pink-500 to-rose-500' },
    { id: 3, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', likes: '2.5k', color: 'from-amber-400 to-orange-500' },
    { id: 4, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', likes: '4.1k', color: 'from-emerald-400 to-teal-500' },
    { id: 5, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=80', likes: '890', color: 'from-blue-500 to-cyan-500' },
    { id: 6, type: 'video', size: 'large', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', views: '88k', color: 'from-violet-500 to-fuchsia-600' },
    { id: 7, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1529139513055-07f909ef3d5c?w=400&q=80', likes: '3.3k', color: 'from-rose-400 to-pink-600' },
    { id: 8, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80', likes: '5.2k', color: 'from-sky-400 to-indigo-500' },
    { id: 9, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80', likes: '1.7k', color: 'from-lime-400 to-green-600' },
    { id: 10, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80', likes: '2.9k', color: 'from-yellow-400 to-orange-600' },
    { id: 11, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80', likes: '6.1k', color: 'from-red-500 to-orange-500' },
    { id: 12, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80', likes: '4.8k', color: 'from-teal-400 to-blue-500' },
  ];

  return (
    <div className="pb-20 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
            Explore <Compass className="ml-3 text-purple-500" size={24} />
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Discover top-performing content across the platform.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search trends..." 
            className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none shadow-sm focus:border-purple-300 dark:focus:border-purple-900/50 transition-all dark:text-zinc-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 grid-flow-dense">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer bg-gradient-to-br ${item.color} ${
              item.size === 'large' ? 'row-span-2 col-span-1 md:col-span-1 aspect-auto' : 'aspect-square'
            }`}
          >
            <img 
              src={item.image} 
              alt="" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = '0';
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center space-x-4 text-white">
                {item.type === 'video' ? (
                  <div className="flex items-center space-x-1">
                    <Play size={18} fill="white" />
                    <span className="font-bold text-sm">{item.views}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Heart size={18} fill="white" />
                    <span className="font-bold text-sm">{item.likes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Type Indicator */}
            <div className="absolute top-4 right-4 text-white drop-shadow-md">
              {item.type === 'video' ? <Play size={14} /> : <ImageIcon size={14} />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
