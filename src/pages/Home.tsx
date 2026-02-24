import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PlayCircle, BarChart2, Brain, Trophy, Sparkles, PlusCircle, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import CreateQuizForm from '../components/CreateQuizForm';

const Home: React.FC = () => {
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center w-full max-w-4xl px-4"
      >
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Brain className="h-16 w-16" />
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Quiz Smarter with AI
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Instantly generate quizzes on any subject using artificial intelligence, or challenge yourself with our curated collection.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/quizzes">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl shadow-xl shadow-indigo-500/20">
              <PlayCircle className="mr-2 h-6 w-6" />
              Browse Quizzes at your fingertips
            </Button>
          </Link>
          <Link to="/results">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl">
              <BarChart2 className="mr-2 h-6 w-6" />
              View Results
            </Button>
          </Link>
          <Button
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20"
            onClick={() => setIsCreateQuizOpen(true)}
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Create Quiz
          </Button>

        </motion.div>

        {/* <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { icon: Wand2, title: "AI-Powered Generation", desc: "Create unique quizzes on any topic in seconds using advanced AI." },
            { icon: Trophy, title: "Track Progress", desc: "See your improvement over time and earn achievements." },
            { icon: Sparkles, title: "Diverse Topics", desc: "Explore quizzes on various subjects from tech to history." }
          ].map((feature, idx) => (
            <Card key={idx} hoverEffect className="border-none bg-white/50 dark:bg-slate-800/50">
              <feature.icon className="h-8 w-8 text-indigo-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </Card>
          ))}
        </motion.div> */}
      </motion.div>

      <Modal
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
        title="Create New Quiz"
      >
        <CreateQuizForm onClose={() => setIsCreateQuizOpen(false)} />
      </Modal>
    </div>
  );
};

export default Home;
