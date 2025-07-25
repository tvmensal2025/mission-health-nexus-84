export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          challenges_faced: string | null
          created_at: string
          goal_achievement_rating: number | null
          id: string
          improvements_noted: string | null
          next_week_goals: string | null
          satisfaction_rating: number | null
          user_id: string
          user_name: string | null
          week_start_date: string
          weight_change: number | null
        }
        Insert: {
          challenges_faced?: string | null
          created_at?: string
          goal_achievement_rating?: number | null
          id?: string
          improvements_noted?: string | null
          next_week_goals?: string | null
          satisfaction_rating?: number | null
          user_id: string
          user_name?: string | null
          week_start_date: string
          weight_change?: number | null
        }
        Update: {
          challenges_faced?: string | null
          created_at?: string
          goal_achievement_rating?: number | null
          id?: string
          improvements_noted?: string | null
          next_week_goals?: string | null
          satisfaction_rating?: number | null
          user_id?: string
          user_name?: string | null
          week_start_date?: string
          weight_change?: number | null
        }
        Relationships: []
      }
      bioimpedance_analysis: {
        Row: {
          ai_recommendations: string[] | null
          body_fat_distribution_android: number | null
          body_fat_distribution_gynoid: number | null
          cellular_health_score: number | null
          created_at: string
          health_warnings: string[] | null
          hydration_status: string | null
          id: string
          measurement_id: string
          metabolic_syndrome_risk: string | null
          mineral_mass_kg: number | null
          muscle_quality_index: number | null
          protein_mass_kg: number | null
          trends_30_days: Json | null
          trends_90_days: Json | null
          user_id: string
        }
        Insert: {
          ai_recommendations?: string[] | null
          body_fat_distribution_android?: number | null
          body_fat_distribution_gynoid?: number | null
          cellular_health_score?: number | null
          created_at?: string
          health_warnings?: string[] | null
          hydration_status?: string | null
          id?: string
          measurement_id: string
          metabolic_syndrome_risk?: string | null
          mineral_mass_kg?: number | null
          muscle_quality_index?: number | null
          protein_mass_kg?: number | null
          trends_30_days?: Json | null
          trends_90_days?: Json | null
          user_id: string
        }
        Update: {
          ai_recommendations?: string[] | null
          body_fat_distribution_android?: number | null
          body_fat_distribution_gynoid?: number | null
          cellular_health_score?: number | null
          created_at?: string
          health_warnings?: string[] | null
          hydration_status?: string | null
          id?: string
          measurement_id?: string
          metabolic_syndrome_risk?: string | null
          mineral_mass_kg?: number | null
          muscle_quality_index?: number | null
          protein_mass_kg?: number | null
          trends_30_days?: Json | null
          trends_90_days?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      challenge_daily_logs: {
        Row: {
          created_at: string | null
          id: string
          is_completed: boolean | null
          log_date: string
          notes: string | null
          numeric_value: number | null
          participation_id: string
          photo_url: string | null
          value_logged: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          log_date?: string
          notes?: string | null
          numeric_value?: number | null
          participation_id: string
          photo_url?: string | null
          value_logged?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          log_date?: string
          notes?: string | null
          numeric_value?: number | null
          participation_id?: string
          photo_url?: string | null
          value_logged?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_daily_logs_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "challenge_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_group_messages: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          message: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          message: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_group_messages_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participations: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string | null
          current_streak: number | null
          id: string
          is_completed: boolean | null
          progress: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participations_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          badge_icon: string | null
          badge_name: string | null
          category: string | null
          created_at: string | null
          daily_log_target: number | null
          daily_log_type: string | null
          daily_log_unit: string | null
          description: string | null
          difficulty: string | null
          duration_days: number
          end_date: string | null
          id: string
          instructions: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_group_challenge: boolean | null
          max_participants: number | null
          points_reward: number | null
          start_date: string | null
          tips: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          badge_icon?: string | null
          badge_name?: string | null
          category?: string | null
          created_at?: string | null
          daily_log_target?: number | null
          daily_log_type?: string | null
          daily_log_unit?: string | null
          description?: string | null
          difficulty?: string | null
          duration_days?: number
          end_date?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_group_challenge?: boolean | null
          max_participants?: number | null
          points_reward?: number | null
          start_date?: string | null
          tips?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          badge_icon?: string | null
          badge_name?: string | null
          category?: string | null
          created_at?: string | null
          daily_log_target?: number | null
          daily_log_type?: string | null
          daily_log_unit?: string | null
          description?: string | null
          difficulty?: string | null
          duration_days?: number
          end_date?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_group_challenge?: boolean | null
          max_participants?: number | null
          points_reward?: number | null
          start_date?: string | null
          tips?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          instructor_name: string | null
          is_premium: boolean | null
          is_published: boolean | null
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_name?: string | null
          is_premium?: boolean | null
          is_published?: boolean | null
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_name?: string | null
          is_premium?: boolean | null
          is_published?: boolean | null
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_saboteurs: {
        Row: {
          characteristics: string[] | null
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          impact: string | null
          is_active: boolean | null
          name: string
          strategies: string[] | null
          updated_at: string
        }
        Insert: {
          characteristics?: string[] | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          impact?: string | null
          is_active?: boolean | null
          name: string
          strategies?: string[] | null
          updated_at?: string
        }
        Update: {
          characteristics?: string[] | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          impact?: string | null
          is_active?: boolean | null
          name?: string
          strategies?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      daily_mission_sessions: {
        Row: {
          completed_sections: string[] | null
          created_at: string | null
          date: string
          id: string
          is_completed: boolean | null
          streak_days: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_sections?: string[] | null
          created_at?: string | null
          date?: string
          id?: string
          is_completed?: boolean | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_sections?: string[] | null
          created_at?: string | null
          date?: string
          id?: string
          is_completed?: boolean | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      daily_responses: {
        Row: {
          answer: string
          created_at: string | null
          date: string
          id: string
          points_earned: number | null
          question_id: string
          section: string
          text_response: string | null
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          date?: string
          id?: string
          points_earned?: number | null
          question_id: string
          section: string
          text_response?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          date?: string
          id?: string
          points_earned?: number | null
          question_id?: string
          section?: string
          text_response?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      google_fit_data: {
        Row: {
          active_minutes: number | null
          calories_burned: number | null
          created_at: string
          data_date: string
          distance_meters: number | null
          heart_rate_avg: number | null
          heart_rate_max: number | null
          heart_rate_resting: number | null
          id: string
          sleep_duration_minutes: number | null
          sleep_quality_score: number | null
          steps_count: number | null
          sync_timestamp: string | null
          user_id: string
          workout_duration_minutes: number | null
          workout_intensity: string | null
          workout_type: string | null
        }
        Insert: {
          active_minutes?: number | null
          calories_burned?: number | null
          created_at?: string
          data_date: string
          distance_meters?: number | null
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          heart_rate_resting?: number | null
          id?: string
          sleep_duration_minutes?: number | null
          sleep_quality_score?: number | null
          steps_count?: number | null
          sync_timestamp?: string | null
          user_id: string
          workout_duration_minutes?: number | null
          workout_intensity?: string | null
          workout_type?: string | null
        }
        Update: {
          active_minutes?: number | null
          calories_burned?: number | null
          created_at?: string
          data_date?: string
          distance_meters?: number | null
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          heart_rate_resting?: number | null
          id?: string
          sleep_duration_minutes?: number | null
          sleep_quality_score?: number | null
          steps_count?: number | null
          sync_timestamp?: string | null
          user_id?: string
          workout_duration_minutes?: number | null
          workout_intensity?: string | null
          workout_type?: string | null
        }
        Relationships: []
      }
      health_diary: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          exercise_minutes: number | null
          id: string
          mood_rating: number | null
          notes: string | null
          sleep_hours: number | null
          user_id: string
          user_name: string | null
          water_intake: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          sleep_hours?: number | null
          user_id: string
          user_name?: string | null
          water_intake?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          sleep_hours?: number | null
          user_id?: string
          user_name?: string | null
          water_intake?: number | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          module_id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          module_id: string
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          module_id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          is_active: boolean | null
          points: number | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          title?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          achievement_alerts: boolean | null
          created_at: string
          enabled: boolean | null
          exercise_motivation: boolean | null
          health_insights: boolean | null
          hydration_reminders: boolean | null
          id: string
          learning_enabled: boolean | null
          max_daily_notifications: number | null
          meal_suggestions: boolean | null
          preferred_times: string[] | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string
          user_id: string
          weight_reminders: boolean | null
        }
        Insert: {
          achievement_alerts?: boolean | null
          created_at?: string
          enabled?: boolean | null
          exercise_motivation?: boolean | null
          health_insights?: boolean | null
          hydration_reminders?: boolean | null
          id?: string
          learning_enabled?: boolean | null
          max_daily_notifications?: number | null
          meal_suggestions?: boolean | null
          preferred_times?: string[] | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string
          user_id: string
          weight_reminders?: boolean | null
        }
        Update: {
          achievement_alerts?: boolean | null
          created_at?: string
          enabled?: boolean | null
          exercise_motivation?: boolean | null
          health_insights?: boolean | null
          hydration_reminders?: boolean | null
          id?: string
          learning_enabled?: boolean | null
          max_daily_notifications?: number | null
          meal_suggestions?: boolean | null
          preferred_times?: string[] | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string
          user_id?: string
          weight_reminders?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          avatar_url: string | null
          created_at: string
          current_weight: number | null
          email: string | null
          full_name: string | null
          gender: string | null
          height: number | null
          id: string
          target_weight: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          current_weight?: number | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          target_weight?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          current_weight?: number | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          target_weight?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          content: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          estimated_time: number | null
          follow_up_questions: string[] | null
          id: string
          is_active: boolean | null
          materials_needed: string[] | null
          target_saboteurs: string[] | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          follow_up_questions?: string[] | null
          id?: string
          is_active?: boolean | null
          materials_needed?: string[] | null
          target_saboteurs?: string[] | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          follow_up_questions?: string[] | null
          id?: string
          is_active?: boolean | null
          materials_needed?: string[] | null
          target_saboteurs?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      smart_notifications: {
        Row: {
          behavioral_data: Json | null
          category: string
          created_at: string
          effectiveness_score: number | null
          expires_at: string | null
          frequency_limit: number | null
          id: string
          is_active: boolean | null
          message: string
          optimal_send_time: string | null
          priority: string | null
          sent_at: string | null
          title: string
          trigger_conditions: Json | null
          type: string
          user_id: string
          user_interaction: string | null
          user_preferences: Json | null
        }
        Insert: {
          behavioral_data?: Json | null
          category: string
          created_at?: string
          effectiveness_score?: number | null
          expires_at?: string | null
          frequency_limit?: number | null
          id?: string
          is_active?: boolean | null
          message: string
          optimal_send_time?: string | null
          priority?: string | null
          sent_at?: string | null
          title: string
          trigger_conditions?: Json | null
          type: string
          user_id: string
          user_interaction?: string | null
          user_preferences?: Json | null
        }
        Update: {
          behavioral_data?: Json | null
          category?: string
          created_at?: string
          effectiveness_score?: number | null
          expires_at?: string | null
          frequency_limit?: number | null
          id?: string
          is_active?: boolean | null
          message?: string
          optimal_send_time?: string | null
          priority?: string | null
          sent_at?: string | null
          title?: string
          trigger_conditions?: Json | null
          type?: string
          user_id?: string
          user_interaction?: string | null
          user_preferences?: Json | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_type: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          progress: number | null
          target: number | null
          title: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          progress?: number | null
          target?: number | null
          title: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          progress?: number | null
          target?: number | null
          title?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_custom_saboteurs: {
        Row: {
          created_at: string
          id: string
          saboteur_id: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          saboteur_id?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          saboteur_id?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_saboteurs_saboteur_id_fkey"
            columns: ["saboteur_id"]
            isOneToOne: false
            referencedRelation: "custom_saboteurs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          gordura_corporal_meta_percent: number | null
          id: string
          imc_meta: number | null
          peso_meta_kg: number | null
          status: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          gordura_corporal_meta_percent?: number | null
          id?: string
          imc_meta?: number | null
          peso_meta_kg?: number | null
          status?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          gordura_corporal_meta_percent?: number | null
          id?: string
          imc_meta?: number | null
          peso_meta_kg?: number | null
          status?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      user_missions: {
        Row: {
          completed_at: string | null
          date_assigned: string
          id: string
          is_completed: boolean | null
          mission_id: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          completed_at?: string | null
          date_assigned?: string
          id?: string
          is_completed?: boolean | null
          mission_id: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          completed_at?: string | null
          date_assigned?: string
          id?: string
          is_completed?: boolean | null
          mission_id?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_physical_data: {
        Row: {
          altura_cm: number
          created_at: string | null
          id: string
          idade: number
          nivel_atividade: string | null
          sexo: string
          updated_at: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          altura_cm: number
          created_at?: string | null
          id?: string
          idade: number
          nivel_atividade?: string | null
          sexo: string
          updated_at?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          altura_cm?: number
          created_at?: string | null
          id?: string
          idade?: number
          nivel_atividade?: string | null
          sexo?: string
          updated_at?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          abdominal_perimeter_cm: number | null
          achievements: string[] | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          created_at: string | null
          full_name: string | null
          gender: string | null
          goals: string[] | null
          height_cm: number | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          abdominal_perimeter_cm?: number | null
          achievements?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          goals?: string[] | null
          height_cm?: number | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          abdominal_perimeter_cm?: number | null
          achievements?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          goals?: string[] | null
          height_cm?: number | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          lesson_id: string
          user_id: string
          user_name: string | null
          watch_time_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id: string
          user_id: string
          user_name?: string | null
          watch_time_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string
          user_id?: string
          user_name?: string | null
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          created_at: string
          due_date: string | null
          feedback: string | null
          id: string
          notes: string | null
          progress: number | null
          session_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          feedback?: string | null
          id?: string
          notes?: string | null
          progress?: number | null
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          feedback?: string | null
          id?: string
          notes?: string | null
          progress?: number | null
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_analyses: {
        Row: {
          created_at: string | null
          id: string
          media_imc: number | null
          observacoes: string | null
          peso_final: number | null
          peso_inicial: number | null
          semana_fim: string
          semana_inicio: string
          tendencia: string | null
          user_id: string | null
          user_name: string | null
          variacao_gordura_corporal: number | null
          variacao_massa_muscular: number | null
          variacao_peso: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_imc?: number | null
          observacoes?: string | null
          peso_final?: number | null
          peso_inicial?: number | null
          semana_fim: string
          semana_inicio: string
          tendencia?: string | null
          user_id?: string | null
          user_name?: string | null
          variacao_gordura_corporal?: number | null
          variacao_massa_muscular?: number | null
          variacao_peso?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          media_imc?: number | null
          observacoes?: string | null
          peso_final?: number | null
          peso_inicial?: number | null
          semana_fim?: string
          semana_inicio?: string
          tendencia?: string | null
          user_id?: string | null
          user_name?: string | null
          variacao_gordura_corporal?: number | null
          variacao_massa_muscular?: number | null
          variacao_peso?: number | null
        }
        Relationships: []
      }
      weekly_insights: {
        Row: {
          average_energy: number | null
          average_mood: number | null
          average_stress: number | null
          created_at: string | null
          exercise_frequency: number | null
          id: string
          most_common_gratitude: string | null
          sleep_consistency: number | null
          streak_days: number | null
          total_points: number | null
          user_id: string | null
          water_consistency: number | null
          week_start_date: string
        }
        Insert: {
          average_energy?: number | null
          average_mood?: number | null
          average_stress?: number | null
          created_at?: string | null
          exercise_frequency?: number | null
          id?: string
          most_common_gratitude?: string | null
          sleep_consistency?: number | null
          streak_days?: number | null
          total_points?: number | null
          user_id?: string | null
          water_consistency?: number | null
          week_start_date: string
        }
        Update: {
          average_energy?: number | null
          average_mood?: number | null
          average_stress?: number | null
          created_at?: string | null
          exercise_frequency?: number | null
          id?: string
          most_common_gratitude?: string | null
          sleep_consistency?: number | null
          streak_days?: number | null
          total_points?: number | null
          user_id?: string | null
          water_consistency?: number | null
          week_start_date?: string
        }
        Relationships: []
      }
      weighings: {
        Row: {
          basal_metabolism: number | null
          bmi: number | null
          body_fat: number | null
          body_water: number | null
          bone_mass: number | null
          created_at: string
          device_type: string | null
          id: string
          metabolic_age: number | null
          muscle_mass: number | null
          user_id: string
          user_name: string | null
          weight: number
        }
        Insert: {
          basal_metabolism?: number | null
          bmi?: number | null
          body_fat?: number | null
          body_water?: number | null
          bone_mass?: number | null
          created_at?: string
          device_type?: string | null
          id?: string
          metabolic_age?: number | null
          muscle_mass?: number | null
          user_id: string
          user_name?: string | null
          weight: number
        }
        Update: {
          basal_metabolism?: number | null
          bmi?: number | null
          body_fat?: number | null
          body_water?: number | null
          bone_mass?: number | null
          created_at?: string
          device_type?: string | null
          id?: string
          metabolic_age?: number | null
          muscle_mass?: number | null
          user_id?: string
          user_name?: string | null
          weight?: number
        }
        Relationships: []
      }
      weight_measurements: {
        Row: {
          agua_corporal_percent: number | null
          circunferencia_abdominal_cm: number | null
          circunferencia_braco_cm: number | null
          circunferencia_perna_cm: number | null
          created_at: string | null
          device_type: string | null
          gordura_corporal_percent: number | null
          gordura_visceral: number | null
          id: string
          idade_metabolica: number | null
          imc: number | null
          massa_muscular_kg: number | null
          measurement_date: string | null
          metabolismo_basal_kcal: number | null
          notes: string | null
          osso_kg: number | null
          peso_kg: number
          risco_metabolico: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          agua_corporal_percent?: number | null
          circunferencia_abdominal_cm?: number | null
          circunferencia_braco_cm?: number | null
          circunferencia_perna_cm?: number | null
          created_at?: string | null
          device_type?: string | null
          gordura_corporal_percent?: number | null
          gordura_visceral?: number | null
          id?: string
          idade_metabolica?: number | null
          imc?: number | null
          massa_muscular_kg?: number | null
          measurement_date?: string | null
          metabolismo_basal_kcal?: number | null
          notes?: string | null
          osso_kg?: number | null
          peso_kg: number
          risco_metabolico?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          agua_corporal_percent?: number | null
          circunferencia_abdominal_cm?: number | null
          circunferencia_braco_cm?: number | null
          circunferencia_perna_cm?: number | null
          created_at?: string | null
          device_type?: string | null
          gordura_corporal_percent?: number | null
          gordura_visceral?: number | null
          id?: string
          idade_metabolica?: number | null
          imc?: number | null
          massa_muscular_kg?: number | null
          measurement_date?: string | null
          metabolismo_basal_kcal?: number | null
          notes?: string | null
          osso_kg?: number | null
          peso_kg?: number
          risco_metabolico?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_display_name: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
