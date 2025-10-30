import { gql } from "@apollo/client";

/**
 * Query to fetch spells for a specific class
 */
export const GET_SPELLS = gql`
  query GetSpells($class: [String!]) {
    spells(class: $class, limit: 1000) {
      name
      desc
      level
      school {
        name
      }
      casting_time
      range
      components
      duration
      higher_level
      damage {
        damage_type {
          name
        }
        damage_at_character_level {
          level
          value
        }
      }
    }
  }
`;
