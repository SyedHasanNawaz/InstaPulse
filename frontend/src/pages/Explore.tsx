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
    { id: 1, type: 'video', size: 'large', image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&q=80', views: '125k' },
    { id: 2, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80', likes: '1.2k' },
    { id: 3, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80', likes: '2.5k' },
    { id: 4, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', likes: '4.1k' },
    { id: 5, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80', likes: '890' },
    { id: 6, type: 'video', size: 'large', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', views: '88k' },
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer aspect-square ${
              item.size === 'large' ? 'row-span-2 col-span-1 md:col-span-1 aspect-auto' : ''
            }`}
          >
            <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
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
