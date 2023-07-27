export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bodyparts: {
        Row: {
          data: Json | null;
          id: number;
          inserted_at: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          data?: Json | null;
          id?: number;
          inserted_at?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          data?: Json | null;
          id?: number;
          inserted_at?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          data: Json | null;
          description: string | null;
          id: number;
          image_url: string | null;
          inserted_at: string;
          name: string;
          slug: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          data?: Json | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          inserted_at?: string;
          name: string;
          slug: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          data?: Json | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          inserted_at?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      exercises_bodyparts: {
        Row: {
          bodypart_id: number;
          exercise_id: number;
          id: number;
        };
        Insert: {
          bodypart_id: number;
          exercise_id: number;
          id?: number;
        };
        Update: {
          bodypart_id?: number;
          exercise_id?: number;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_bodyparts_bodypart_id_fkey';
            columns: ['bodypart_id'];
            referencedRelation: 'bodyparts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_bodyparts_exercise_id_fkey';
            columns: ['exercise_id'];
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          }
        ];
      };
      exercises_stages: {
        Row: {
          exercise_id: number;
          id: number;
          stage_id: number;
        };
        Insert: {
          exercise_id: number;
          id?: number;
          stage_id: number;
        };
        Update: {
          exercise_id?: number;
          id?: number;
          stage_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_stages_exercise_id_fkey';
            columns: ['exercise_id'];
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_stages_stage_id_fkey';
            columns: ['stage_id'];
            referencedRelation: 'stages';
            referencedColumns: ['id'];
          }
        ];
      };
      stages: {
        Row: {
          data: Json | null;
          id: number;
          inserted_at: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          data?: Json | null;
          id?: number;
          inserted_at?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          data?: Json | null;
          id?: number;
          inserted_at?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
