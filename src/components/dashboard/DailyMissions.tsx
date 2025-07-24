import React from 'react';
import { User } from '@supabase/supabase-js';
import { DailyMissionsNew } from '@/components/daily-missions/DailyMissionsNew';
import { DailyMissionsSimple } from '@/components/daily-missions/DailyMissionsSimple';
import { DailyMissionsEnhanced } from '@/components/daily-missions/DailyMissionsEnhanced';
import { DailyMissionsFinal } from '@/components/daily-missions/DailyMissionsFinal';
import { TestDailyMissions } from '@/components/daily-missions/TestDailyMissions';
import { DebugDailyMissions } from '@/components/daily-missions/DebugDailyMissions';

interface DailyMissionsProps {
  user: User | null;
}

const DailyMissions = ({ user }: DailyMissionsProps) => {
  // Versão final com todas as perguntas corretas
  return <DailyMissionsFinal user={user} />;
};

export default DailyMissions;