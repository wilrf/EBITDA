# EBITDA: Complete Project Documentation

## Table of Contents

1. [Documentation (README files, specs)](#documentation)
2. [Configuration Schemas](#configuration-schemas)  
3. [Configuration Samples](#configuration-samples)
4. [Actual Configuration Files](#actual-configuration-files)
5. [TypeScript Source Code](#typescript-source-code)
6. [Project Configuration Files](#project-configuration-files)

---

## Documentation

### C:\Users\wilso\Downloads\EBITDA\README.md

```markdown
# EBITDA: Private Equity Firm — Game Architecture & Config Manifest
Version 0.1 · 2025-08-24

(See files in this kit for full details.)
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\README.md

```markdown
# EBITDA: Private Equity Firm — Game Architecture & Config Manifest
Version 0.1 · 2025-08-24

(See files in this kit for full details.)
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\README.md

```markdown
# EBITDA — Private Equity Firm: The Game (Skeleton)
**Version:** 0.1 • **Date:** 2025-08-24

This is a coded skeleton of the game, using **React + TypeScript + Vite**, with a **deterministic simulation core** and UI stubs:
- Seeded PRNG, day→week→quarter loop
- Macro heat / risk stress → pricing & multiples
- Auctions (rivals), Capital Stack builder (simplified), Covenant checks (simplified)
- Event engine with **Hostile Bid** example
- **Weekly Report** surfacing KPIs + suggested actions
- Difficulty packs & scenario/config files (static)

> Core outcomes are deterministic (no AI). An optional *Aura* adviser can be added later as non-authoritative flavor.

## Quick start
```bash
npm install
npm run dev
# Visit http://localhost:5173
```

## Structure
- `src/engine/` — deterministic sim modules (macro, auctions, capital, events, etc.)
- `src/components/` — UI: WeeklyReport, DealCard, Meters
- `public/config/` — JSON configs (difficulty, scenarios, economy coefficients, events, archetypes, etc.)

## Notes
- Numbers are placeholders for prototyping. Replace configs with real data during content pass.
- The engine is designed to be replayable from a seed; keep outcome logic in `src/engine/*` modules.
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\api\endpoints.md

```markdown
See README for endpoint overview.
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\loop_spec.md

```markdown
Daily → Weekly → Quarterly loop spec.
```

---

## Configuration Schemas

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\achievements.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Achievements & Badges",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "achievements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "desc": {
            "type": "string"
          },
          "criteria": {
            "type": "object"
          },
          "score_bonus": {
            "type": "number"
          }
        },
        "required": [
          "id",
          "name",
          "criteria"
        ]
      }
    }
  },
  "required": [
    "version",
    "achievements"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\difficulty.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Difficulty Pack",
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "version": {
      "type": "string"
    },
    "gates": {
      "type": "object",
      "properties": {
        "enable_mezz": {
          "type": "boolean"
        },
        "enable_2L": {
          "type": "boolean"
        },
        "enable_covlite": {
          "type": "boolean"
        },
        "enable_hedging": {
          "type": "boolean"
        },
        "enable_antitrust": {
          "type": "boolean"
        },
        "enable_hostile": {
          "type": "boolean"
        },
        "enable_greenmail": {
          "type": "boolean"
        },
        "enable_club_deals": {
          "type": "boolean"
        },
        "enable_pacman": {
          "type": "boolean"
        },
        "enable_continuation": {
          "type": "boolean"
        },
        "enable_cyber": {
          "type": "boolean"
        },
        "enable_labor": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "multipliers": {
      "type": "object",
      "properties": {
        "macro_vol": {
          "type": "number"
        },
        "rivals_count": {
          "type": "integer"
        },
        "snipe_odds": {
          "type": "number"
        },
        "spread_adders_bps": {
          "type": "integer"
        },
        "leverage_cap": {
          "type": "number"
        },
        "covenant_headroom_pct": {
          "type": "number"
        },
        "info_noise": {
          "type": "number"
        },
        "crisis_timer_scale": {
          "type": "number"
        },
        "trust_decay_scale": {
          "type": "number"
        },
        "score_mult": {
          "type": "number"
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "version",
    "gates",
    "multipliers"
  ],
  "additionalProperties": false
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\economy_coeffs.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Economy Coefficients",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "macro_to_game": {
      "type": "object"
    },
    "pricing": {
      "type": "object"
    },
    "defaults": {
      "type": "object"
    }
  },
  "required": [
    "version",
    "macro_to_game",
    "pricing",
    "defaults"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\events.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Event Cards & Chains",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "rarity": {
            "type": "string",
            "enum": [
              "common",
              "uncommon",
              "rare",
              "legendary"
            ]
          },
          "trigger": {
            "type": "object"
          },
          "timer_days": {
            "type": "integer"
          },
          "text": {
            "type": "string"
          },
          "choices": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "label": {
                  "type": "string"
                },
                "reqs": {
                  "type": "object"
                },
                "effects": {
                  "type": "object"
                },
                "spawn_event": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "win_if": {
                  "type": [
                    "object",
                    "null"
                  ]
                }
              },
              "required": [
                "id",
                "label"
              ]
            }
          },
          "touches": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "id",
          "rarity",
          "trigger",
          "timer_days",
          "text",
          "choices"
        ]
      }
    }
  },
  "required": [
    "version",
    "events"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\lender_policy.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Lender Policy",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "trust_memory": {
      "type": "object"
    },
    "flex_bands": {
      "type": "object"
    },
    "amend_fee_schedule": {
      "type": "object"
    },
    "cov_defaults": {
      "type": "object"
    }
  },
  "required": [
    "version",
    "trust_memory",
    "flex_bands",
    "amend_fee_schedule",
    "cov_defaults"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\lp_personas.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LP Personas",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "personas": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "patience": {
            "type": "number"
          },
          "fee_sensitivity": {
            "type": "number"
          },
          "esg_strictness": {
            "type": "number"
          },
          "side_letters": {
            "type": "object"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "version",
    "personas"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\macro_scenarios.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Macro Scenarios",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "scenarios": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "scenario_id": {
            "type": "string"
          },
          "display_name": {
            "type": "string"
          },
          "start_date": {
            "type": "string"
          },
          "frequency": {
            "type": "string",
            "enum": [
              "weekly",
              "monthly",
              "quarterly"
            ]
          },
          "duration_steps": {
            "type": "integer"
          },
          "dates": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "series": {
            "type": "object"
          },
          "exogenous_events": {
            "type": "array",
            "items": {
              "type": "object"
            }
          },
          "notes": {
            "type": "string"
          }
        },
        "required": [
          "scenario_id",
          "display_name",
          "start_date",
          "frequency",
          "duration_steps",
          "series"
        ]
      }
    }
  },
  "required": [
    "version",
    "scenarios"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\rival_archetypes.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Rival Archetypes",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "archetypes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "snipe_odds": {
            "type": "object",
            "properties": {
              "base": {
                "type": "number"
              },
              "hot_sector_bonus": {
                "type": "number"
              }
            },
            "required": [
              "base",
              "hot_sector_bonus"
            ]
          },
          "hostile_pref": {
            "type": "number"
          },
          "leak_rate": {
            "type": "number"
          },
          "discipline": {
            "type": "number"
          },
          "legal_aggressiveness": {
            "type": "number"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "version",
    "archetypes"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\schemas\tutorials.schema.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Tutorial Scripts",
  "type": "object",
  "properties": {
    "version": {
      "type": "string"
    },
    "scenes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "steps": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "text": {
                  "type": "string"
                },
                "requirement": {
                  "type": "object"
                },
                "success": {
                  "type": "object"
                },
                "fail": {
                  "type": "object"
                }
              },
              "required": [
                "id",
                "text"
              ]
            }
          }
        },
        "required": [
          "id",
          "steps"
        ]
      }
    }
  },
  "required": [
    "version",
    "scenes"
  ]
}
```

---

## Configuration Samples

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\achievements.sample.json

```json
{
  "version": "0.1.0",
  "achievements": [
    {
      "id": "no_recap_run",
      "name": "No Recap Run",
      "desc": "Finish a fund without a recap.",
      "criteria": {
        "recaps_used": 0
      },
      "score_bonus": 100
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\difficulty.sample.json

```json
{
  "id": "hard_v1",
  "version": "0.1.0",
  "gates": {
    "enable_mezz": true,
    "enable_2L": true,
    "enable_covlite": true,
    "enable_hedging": true,
    "enable_antitrust": true,
    "enable_hostile": true,
    "enable_greenmail": true,
    "enable_club_deals": true,
    "enable_pacman": true,
    "enable_continuation": true,
    "enable_cyber": true,
    "enable_labor": true
  },
  "multipliers": {
    "macro_vol": 1.4,
    "rivals_count": 7,
    "snipe_odds": 0.2,
    "spread_adders_bps": 200,
    "leverage_cap": 4.5,
    "covenant_headroom_pct": 5,
    "info_noise": 0.2,
    "crisis_timer_scale": 0.8,
    "trust_decay_scale": 1.4,
    "score_mult": 1.5
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\economy_coeffs.sample.json

```json
{
  "version": "0.1.0",
  "macro_to_game": {
    "M_formula": "0.5*ER + 0.3*G - 0.02*VX",
    "R_formula": "0.015*VX + 0.002*(HY-400)"
  },
  "pricing": {
    "spread_curve_bps": {
      "b0": 300
    },
    "fees": {
      "oid_base_pct": 1.0
    }
  },
  "defaults": {
    "breach_targets_annual_at_5x": {
      "easy": [
        0.02,
        0.04
      ],
      "medium": [
        0.05,
        0.08
      ],
      "hard": [
        0.1,
        0.15
      ]
    }
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\events_ops.sample.json

```json
{
  "version": "0.1.0",
  "events": [
    {
      "id": "tsa_dependency_overdue_v1",
      "rarity": "common",
      "trigger": {
        "type": "tsa_overdue"
      },
      "timer_days": 5,
      "text": "TSA IT cutover behind schedule.",
      "choices": [
        {
          "id": "throw_bodies",
          "label": "Deploy ops bench"
        }
      ],
      "touches": [
        "Execution"
      ]
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\events_takeovers.sample.json

```json
{
  "version": "0.1.0",
  "events": [
    {
      "id": "hostile_bid_public_v1",
      "rarity": "rare",
      "trigger": {
        "type": "public_underpriced"
      },
      "timer_days": 7,
      "text": "Rival launches a hostile.",
      "choices": [
        {
          "id": "adopt_pill",
          "label": "Adopt poison pill"
        }
      ],
      "touches": [
        "LPTrust",
        "Momentum"
      ]
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\lender_policy.sample.json

```json
{
  "version": "0.1.0",
  "trust_memory": {
    "good_quarter": "+2",
    "bad_action_range": [
      -3,
      -8
    ]
  },
  "flex_bands": {
    "spread_bps": [
      50,
      150
    ]
  },
  "amend_fee_schedule": {
    "base_bps": 50
  },
  "cov_defaults": {
    "Lmax": 5.0,
    "Imin": 1.8
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\lp_personas.sample.json

```json
{
  "version": "0.1.0",
  "personas": [
    {
      "id": "pension_long_horizon",
      "patience": 0.8,
      "fee_sensitivity": 0.6,
      "esg_strictness": 0.5,
      "side_letters": {
        "reporting": "enhanced"
      }
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\macro_scenarios.sample.json

```json
{
  "version": "0.1.0",
  "scenarios": [
    {
      "scenario_id": "2007_crisis_demo",
      "display_name": "2007–2009 GFC Demo",
      "start_date": "2007-01-01",
      "frequency": "quarterly",
      "duration_steps": 12,
      "series": {
        "gdp_growth_pct": [
          2.5,
          2.2
        ]
      }
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\rival_archetypes.sample.json

```json
{
  "version": "0.1.0",
  "archetypes": [
    {
      "id": "multiple_maxer",
      "snipe_odds": {
        "base": 0.22,
        "hot_sector_bonus": 0.1
      },
      "hostile_pref": 0.4,
      "leak_rate": 0.35,
      "discipline": 0.3,
      "legal_aggressiveness": 0.5
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\EBITDA_Architecture_Kit\configs\samples\tutorials.sample.json

```json
{
  "version": "0.1.0",
  "scenes": [
    {
      "id": "lemonade_stand_intro",
      "steps": [
        {
          "id": "borrow",
          "text": "Borrow to buy the stand."
        }
      ]
    }
  ]
}
```

---

## Actual Configuration Files

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\achievements.json

```json
{
  "version": "0.1.0",
  "achievements": [
    {
      "id": "no_recap_run",
      "name": "No Recap Run",
      "desc": "Complete a fund without a dividend recap.",
      "criteria": {
        "recaps_used": 0
      },
      "score_bonus": 100
    },
    {
      "id": "covenant_clean_sheet",
      "name": "Covenant Clean Sheet",
      "desc": "No covenant breaches in a fund.",
      "criteria": {
        "breaches": 0
      },
      "score_bonus": 150
    },
    {
      "id": "hostile_defender",
      "name": "Hostile Defender",
      "desc": "Successfully defend against a hostile bid.",
      "criteria": {
        "hostile_defended": 1
      },
      "score_bonus": 200
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\difficulty.json

```json
{
  "id": "hard_v1",
  "version": "0.1.0",
  "gates": {
    "enable_mezz": true,
    "enable_2L": true,
    "enable_covlite": true,
    "enable_hedging": true,
    "enable_antitrust": true,
    "enable_hostile": true,
    "enable_greenmail": true,
    "enable_club_deals": true,
    "enable_pacman": true,
    "enable_continuation": true,
    "enable_cyber": true,
    "enable_labor": true
  },
  "multipliers": {
    "macro_vol": 1.4,
    "rivals_count": 7,
    "snipe_odds": 0.2,
    "spread_adders_bps": 200,
    "leverage_cap": 4.5,
    "covenant_headroom_pct": 5,
    "info_noise": 0.2,
    "crisis_timer_scale": 0.8,
    "trust_decay_scale": 1.4,
    "score_mult": 1.5
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\economy_coeffs.json

```json
{
  "version": "0.1.0",
  "macro_to_game": {
    "M_formula": "0.5*ER + 0.3*G - 0.02*VX; clip(-2,+2)",
    "R_formula": "0.015*VX + 0.002*(HY-400); clip(0,+3)",
    "multiple_multiplier": "1 + 0.06*M - 0.03*R",
    "reputation_bonus": "0.04 * sigmoid((Rep-50)/12)"
  },
  "pricing": {
    "spread_curve_bps": {
      "b0": 300,
      "b1_per_0_5x_over": 80,
      "b2_covlite": 50,
      "b3_trust_tier_loss": 20,
      "b4_R_slope": 30,
      "b5_rep_tier": 20
    },
    "fees": {
      "oid_base_pct": 1.0,
      "oid_per_R_pct": 0.3,
      "ticking_fee_bps_range": [
        50,
        100
      ]
    }
  },
  "defaults": {
    "breach_targets_annual_at_5x": {
      "easy": [
        0.02,
        0.04
      ],
      "medium": [
        0.05,
        0.08
      ],
      "hard": [
        0.1,
        0.15
      ]
    }
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\events_ops.json

```json
{
  "version": "0.1.0",
  "events": [
    {
      "id": "tsa_dependency_overdue_v1",
      "rarity": "common",
      "trigger": {
        "type": "tsa_overdue",
        "function": "IT",
        "days_over": 14
      },
      "timer_days": 5,
      "text": "TSA IT cutover is behind schedule; penalties loom.",
      "choices": [
        {
          "id": "throw_bodies",
          "label": "Deploy ops bench",
          "effects": {
            "ops_capacity": -1
          }
        },
        {
          "id": "accept_penalty",
          "label": "Eat the penalty",
          "effects": {
            "cash": -250000
          }
        },
        {
          "id": "delay_close",
          "label": "Delay cutover",
          "effects": {
            "momentum_mult": -0.05
          }
        }
      ],
      "touches": [
        "Execution",
        "Momentum",
        "Cash"
      ]
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\events_takeovers.json

```json
{
  "version": "0.1.0",
  "events": [
    {
      "id": "hostile_bid_public_v1",
      "rarity": "rare",
      "trigger": {
        "type": "public_underpriced",
        "min_gap_x": 0.7,
        "min_fragility": 60,
        "max_board_gov": 45
      },
      "timer_days": 7,
      "text": "A rival fund launches a hostile at {multiple}×.",
      "choices": [
        {
          "id": "adopt_pill",
          "label": "Adopt poison pill",
          "effects": {
            "timer_days": "+14",
            "momentum_mult": -0.1,
            "lp_trust": -2
          }
        },
        {
          "id": "white_knight",
          "label": "Seek white knight",
          "spawn_event": "white_knight_v1"
        },
        {
          "id": "raise_bid",
          "label": "Raise bid (re-gear)",
          "effects": {
            "leverage": "+0.8",
            "lender_trust": -5
          }
        },
        {
          "id": "accept",
          "label": "Accept",
          "effects": {
            "exit_now": true,
            "lp_trust": -1,
            "optics": -10
          }
        }
      ],
      "touches": [
        "Fragility",
        "LPTrust",
        "Momentum",
        "Optics"
      ]
    },
    {
      "id": "toehold_greenmail_v1",
      "rarity": "uncommon",
      "trigger": {
        "type": "13D_toehold",
        "min_stake_pct": 6,
        "max_board_gov": 50
      },
      "timer_days": 5,
      "text": "A raider files 13D and demands changes or payment.",
      "choices": [
        {
          "id": "standstill",
          "label": "Negotiate standstill",
          "effects": {
            "cash_pct_equity": -1.2,
            "lp_trust": -1
          }
        },
        {
          "id": "recap",
          "label": "Special dividend recap",
          "effects": {
            "fragility": "+15"
          }
        },
        {
          "id": "pacman",
          "label": "Pac-Man defense (Hard)",
          "effects": {
            "lender_trust": -4,
            "fees_bps": "+75"
          }
        }
      ],
      "touches": [
        "Fragility",
        "LPTrust",
        "LenderTrust"
      ]
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\lender_policy.json

```json
{
  "version": "0.1.0",
  "trust_memory": {
    "good_quarter": "+2",
    "bad_action_range": [
      -3,
      -8
    ]
  },
  "flex_bands": {
    "spread_bps": [
      50,
      150
    ],
    "oid_pct": [
      0.5,
      1.0
    ],
    "cov_tighten_x": [
      0.0,
      0.25
    ]
  },
  "amend_fee_schedule": {
    "base_bps": 50,
    "stress_adder_bps_per_R": 40
  },
  "cov_defaults": {
    "Lmax": 5.0,
    "Imin": 1.8
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\lp_personas.json

```json
{
  "version": "0.1.0",
  "personas": [
    {
      "id": "pension_long_horizon",
      "patience": 0.8,
      "fee_sensitivity": 0.6,
      "esg_strictness": 0.5,
      "side_letters": {
        "reporting": "enhanced"
      }
    },
    {
      "id": "endowment_alpha_hunter",
      "patience": 0.5,
      "fee_sensitivity": 0.4,
      "esg_strictness": 0.3,
      "side_letters": {
        "co_invest": "priority"
      }
    },
    {
      "id": "family_office_relationship",
      "patience": 0.7,
      "fee_sensitivity": 0.5,
      "esg_strictness": 0.2,
      "side_letters": {
        "fees": "discount"
      }
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\macro_scenarios.json

```json
{
  "version": "0.1.0",
  "scenarios": [
    {
      "scenario_id": "2007_crisis_demo",
      "display_name": "2007–2009 GFC Demo (Placeholder)",
      "start_date": "2007-01-01",
      "frequency": "quarterly",
      "duration_steps": 12,
      "dates": [
        "2007-01-01",
        "2007-04-01",
        "2007-07-01",
        "2007-10-01",
        "2008-01-01",
        "2008-04-01",
        "2008-07-01",
        "2008-10-01",
        "2009-01-01",
        "2009-04-01",
        "2009-07-01",
        "2009-10-01"
      ],
      "series": {
        "gdp_growth_pct": [
          2.5,
          2.2,
          1.8,
          0.9,
          -1.0,
          -2.5,
          -3.0,
          -1.2,
          0.5,
          1.2,
          2.1,
          2.4
        ],
        "fed_funds_rate_pct": [
          5.25,
          5.0,
          4.75,
          4.0,
          3.0,
          2.0,
          1.0,
          0.5,
          0.25,
          0.25,
          0.5,
          1.0
        ],
        "sp500_total_return_pct": [
          1.5,
          1.2,
          0.5,
          -3.0,
          -7.5,
          -12.0,
          -8.0,
          -4.0,
          2.0,
          4.5,
          3.0,
          2.5
        ],
        "vix_level": [
          13,
          14,
          16,
          20,
          28,
          40,
          45,
          35,
          25,
          20,
          18,
          16
        ],
        "credit_spread_hy_bps": [
          300,
          320,
          350,
          450,
          650,
          900,
          1000,
          800,
          600,
          450,
          380,
          330
        ],
        "credit_spread_ig_bps": [
          110,
          120,
          140,
          180,
          240,
          300,
          320,
          260,
          200,
          160,
          140,
          120
        ],
        "unemployment_rate_pct": [
          4.6,
          4.6,
          4.7,
          5.0,
          5.3,
          6.0,
          7.0,
          8.0,
          8.8,
          9.2,
          9.0,
          8.7
        ],
        "base_sector_multiple": {
          "tech_ev_ebitda": [
            11,
            11,
            10.5,
            9.5,
            8.5,
            7.5,
            7.0,
            7.5,
            8.0,
            8.5,
            9.0,
            9.5
          ],
          "industrials_ev_ebitda": [
            7.5,
            7.5,
            7.2,
            6.8,
            6.2,
            5.8,
            5.5,
            5.7,
            6.1,
            6.4,
            6.7,
            7.0
          ],
          "consumer_ev_ebitda": [
            8.5,
            8.5,
            8.1,
            7.4,
            6.6,
            6.0,
            5.7,
            6.0,
            6.5,
            7.0,
            7.4,
            7.8
          ],
          "healthcare_ev_ebitda": [
            9.0,
            9.0,
            8.7,
            8.2,
            7.8,
            7.4,
            7.2,
            7.4,
            7.7,
            8.0,
            8.4,
            8.7
          ],
          "energy_ev_ebitda": [
            6.5,
            6.6,
            6.7,
            6.9,
            7.2,
            7.6,
            7.4,
            7.0,
            6.6,
            6.4,
            6.5,
            6.6
          ],
          "services_ev_ebitda": [
            8.0,
            8.0,
            7.7,
            7.1,
            6.5,
            6.0,
            5.8,
            6.0,
            6.3,
            6.7,
            7.0,
            7.3
          ]
        }
      },
      "exogenous_events": [
        {
          "date": "2008-09-01",
          "tag": "LehmanShock",
          "magnitude": 1.0,
          "decay_steps": 3
        },
        {
          "date": "2009-03-01",
          "tag": "QE_Round1",
          "magnitude": -0.6,
          "decay_steps": 4
        }
      ],
      "notes": "Illustrative placeholders; replace with real historical data."
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\rival_archetypes.json

```json
{
  "version": "0.1.0",
  "archetypes": [
    {
      "id": "multiple_maxer",
      "snipe_odds": {
        "base": 0.22,
        "hot_sector_bonus": 0.1
      },
      "hostile_pref": 0.4,
      "leak_rate": 0.35,
      "discipline": 0.3,
      "legal_aggressiveness": 0.5
    },
    {
      "id": "discipline_bot",
      "snipe_odds": {
        "base": 0.1,
        "hot_sector_bonus": 0.05
      },
      "hostile_pref": 0.1,
      "leak_rate": 0.1,
      "discipline": 0.8,
      "legal_aggressiveness": 0.2
    },
    {
      "id": "raider_aggressive",
      "snipe_odds": {
        "base": 0.25,
        "hot_sector_bonus": 0.1
      },
      "hostile_pref": 0.7,
      "leak_rate": 0.4,
      "discipline": 0.3,
      "legal_aggressiveness": 0.8
    }
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\public\config\tutorials.json

```json
{
  "version": "0.1.0",
  "scenes": [
    {
      "id": "lemonade_stand_intro",
      "steps": [
        {
          "id": "borrow",
          "text": "Borrow at 8% to buy the stand."
        },
        {
          "id": "improve",
          "text": "Increase price or cut cost; watch EBITDA rise."
        },
        {
          "id": "micro_breach",
          "text": "A rain shock hits; survive a tiny covenant scare."
        },
        {
          "id": "exit",
          "text": "Sell at 6.5× multiple; see DPI bump."
        }
      ]
    }
  ]
}
```

---

## TypeScript Source Code

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\data\loadConfig.ts

```typescript
import type { DifficultyPack, MacroManifest, EconomyCoeffs, EventDeck, RivalArchetype, LenderPolicy, LPPersona } from '../engine/types'

export async function loadAllConfigs() {
  const [difficulty, macro, economy, takeovers, ops, rivals, lender, lps] = await Promise.all([
    fetch('/config/difficulty.json').then(r=>r.json()) as Promise<DifficultyPack>,
    fetch('/config/macro_scenarios.json').then(r=>r.json()) as Promise<MacroManifest>,
    fetch('/config/economy_coeffs.json').then(r=>r.json()) as Promise<EconomyCoeffs>,
    fetch('/config/events_takeovers.json').then(r=>r.json()) as Promise<EventDeck>,
    fetch('/config/events_ops.json').then(r=>r.json()) as Promise<EventDeck>,
    fetch('/config/rival_archetypes.json').then(r=>r.json()) as Promise<{version:string; archetypes:RivalArchetype[]}>,
    fetch('/config/lender_policy.json').then(r=>r.json()) as Promise<LenderPolicy>,
    fetch('/config/lp_personas.json').then(r=>r.json()) as Promise<{version:string; personas:LPPersona[]}>,
  ])
  return { difficulty, macro, economy, takeovers, ops, rivals: rivals.archetypes, lender, lps: lps.personas }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\types.ts

```typescript
export type Mode = 'easy' | 'medium' | 'hard'

export interface DifficultyGates {
  enable_mezz: boolean
  enable_2L: boolean
  enable_covlite: boolean
  enable_hedging: boolean
  enable_antitrust: boolean
  enable_hostile: boolean
  enable_greenmail: boolean
  enable_club_deals: boolean
  enable_pacman: boolean
  enable_continuation: boolean
  enable_cyber: boolean
  enable_labor: boolean
}

export interface DifficultyPack {
  id: string
  version: string
  gates: DifficultyGates
  multipliers: {
    macro_vol: number
    rivals_count: number
    snipe_odds: number
    spread_adders_bps: number
    leverage_cap: number
    covenant_headroom_pct: number
    info_noise: number
    crisis_timer_scale: number
    trust_decay_scale: number
    score_mult: number
  }
}

export interface Scenario {
  scenario_id: string
  start_date: string
  frequency: 'weekly' | 'monthly' | 'quarterly'
  duration_steps: number
  dates?: string[]
  series: Record<string, any>
}

export interface MacroManifest {
  version: string
  scenarios: Scenario[]
}

export interface EconomyCoeffs {
  version: string
  macro_to_game: Record<string, any>
  pricing: Record<string, any>
  defaults: Record<string, any>
}

export interface RivalArchetype {
  id: string
  snipe_odds: { base: number; hot_sector_bonus: number }
  hostile_pref: number
  leak_rate: number
  discipline: number
  legal_aggressiveness: number
}

export interface LenderPolicy {
  version: string
  trust_memory: Record<string, any>
  flex_bands: Record<string, any>
  amend_fee_schedule: Record<string, any>
  cov_defaults: { Lmax: number; Imin: number }
}

export interface LPPersona {
  id: string
  patience: number
  fee_sensitivity: number
  esg_strictness: number
  side_letters: Record<string, any>
}

export interface EventChoice {
  id: string
  label: string
  reqs?: Record<string, any>
  effects?: Record<string, any>
  spawn_event?: string | null
}

export interface EventCard {
  id: string
  rarity: 'common'|'uncommon'|'rare'|'legendary'
  trigger: Record<string, any>
  timer_days: number
  text: string
  choices: EventChoice[]
  touches?: string[]
}

export interface EventDeck { version: string; events: EventCard[] }

export interface Deal {
  id: string
  name: string
  sector: string
  baseMultiple: number
  entryMultiple: number
  leverage: number
  covenants: { Lmax: number; Imin: number }
  public: boolean
  metrics: { ebitda: number; revenue: number }
  meters: { fragility: number; execution: number; momentum: number }
}

export interface Fund {
  id: string
  vintage: number
  size: number
  cash: number
  undrawn: number
  dpi: number
  rvpi: number
  tvpi: number
  netIRR: number
}

export interface Firm {
  reputation: number
  lenderTrust: number
  lpTrust: number
  auditComfort: number
  boardGov: number
  opsCapacity: number
  culture: number
}

export interface GameState {
  mode: Mode
  day: number
  week: number
  quarter: number
  seed: number
  firm: Firm
  fund: Fund
  deals: Deal[]
  activeEvents: ActiveEvent[]
  pipeline: Deal[]
  kpis: Record<string, number>
}

export interface ActiveEvent {
  id: string
  card: EventCard
  endsOnDay: number
  dealId?: string
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\state.ts

```typescript
import type { GameState, Deal, Fund, Firm, Mode, Scenario, EconomyCoeffs, DifficultyPack, EventDeck, RivalArchetype, LenderPolicy, LPPersona } from './types'
import { PRNG } from './prng'
import { computeMacroStep } from './macro'
import { runAuction } from './auctions'
import { priceDebt } from './capitalStack'
import { checkCovenants } from './covenants'
import { spawnEventFromDeck, advanceEvents } from './events'

export interface EngineConfig {
  mode: Mode
  seed: number
  scenario: Scenario
  economy: EconomyCoeffs
  difficulty: DifficultyPack
  decks: { takeovers: EventDeck; ops: EventDeck }
  rivals: RivalArchetype[]
  lenderPolicy: LenderPolicy
  lpPersonas: LPPersona[]
}

export class GameEngine {
  public state: GameState
  private prng: PRNG
  private cfg: EngineConfig

  constructor(cfg: EngineConfig) {
    this.cfg = cfg
    this.prng = new PRNG(cfg.seed)
    const firm: Firm = { reputation: 50, lenderTrust: 50, lpTrust: 50, auditComfort: 60, boardGov: 55, opsCapacity: 3, culture: 50 }
    const fund: Fund = { id: 'Fund I', vintage: 1, size: 100_000_000, cash: 20_000_000, undrawn: 80_000_000, dpi: 0, rvpi: 1, tvpi: 1, netIRR: 0 }
    const pipeline = this.generateInitialPipeline()
    this.state = {
      mode: cfg.mode, day: 1, week: 1, quarter: 1, seed: cfg.seed,
      firm, fund, deals: [], activeEvents: [], pipeline, kpis: {}
    }
  }

  private generateInitialPipeline(): Deal[] {
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, 0)
    const sectors = Object.keys(macro.baseSectorMultiple)
    const picks = sectors.slice(0, 3)
    return picks.map((s, i) => ({
      id: `P${i+1}`,
      name: `${s.toUpperCase()} Co`,
      sector: s,
      baseMultiple: macro.baseSectorMultiple[s] ?? 7.5,
      entryMultiple: (macro.baseSectorMultiple[s] ?? 7.5) * (1 + 0.02 * (this.state?.firm?.reputation ?? 50 - 50)/10),
      leverage: 4.5,
      covenants: { Lmax: this.cfg.lenderPolicy.cov_defaults.Lmax, Imin: this.cfg.lenderPolicy.cov_defaults.Imin },
      public: false,
      metrics: { ebitda: 10_000_000, revenue: 100_000_000 },
      meters: { fragility: 40, execution: 55, momentum: 50 }
    }))
  }

  tickDay() {
    const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    this.state.kpis['M'] = macro.M
    this.state.kpis['R'] = macro.R

    // progress timers & events
    advanceEvents(this.state)

    // light random drift on reputation/momentum (placeholder)
    this.state.firm.reputation = clamp(this.state.firm.reputation + (this.prng.range(-0.3, 0.4)), 0, 100)
    this.state.day += 1

    // week gate every 7 days
    if (this.state.day % 7 === 0) {
      this.state.week += 1
    }
    // quarter gate every 13 weeks (approx skeleton)
    if (this.state.week % 13 === 0 && this.state.day % 7 === 0) {
      this.state.quarter += 1
      // trust drift
      this.state.firm.lenderTrust = clamp(this.state.firm.lenderTrust + 1, 0, 100)
    }
  }

  startAuctionForPipeline(i: number) {
    const deal = this.state.pipeline[i]
    if (!deal) return { ok: false }
    // Initialize rivals subset
    const rivalSet = this.cfg.rivals.slice(0, Math.max(2, Math.min(this.cfg.difficulty.multipliers.rivals_count, this.cfg.rivals.length)))
    const heat = clamp(this.state.kpis['M'] ?? 0, -2, 2) / 2 + 0.5
    const res = runAuction(this.prng, deal, rivalSet, heat)
    if (res.winner === 'player') {
      this.state.deals.push(deal)
      this.state.pipeline.splice(i,1)
      return { ok: True, won: True, multiple: res.clearingMultiple }
    } else if (res.winner === 'rival') {
      this.state.pipeline.splice(i,1)
      return { ok: True, won: False, rival: res.rivalId, multiple: res.clearingMultiple }
    } else {
      return { ok: True, won: False, walk: True, multiple: res.clearingMultiple }
    }
  }

  priceDebtPreview(leverage: number, covLite: boolean) {
    const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    const baseRate = (this.cfg.scenario.series.fed_funds_rate_pct?.[step] ?? 2.0)
    const ts = priceDebt(baseRate, leverage, 5.0, covLite, this.state.firm.lenderTrust, macro.R, Math.floor(this.state.firm.reputation/20), this.cfg.lenderPolicy)
    return ts
  }

  weeklyReport() {
    // Compose a lightweight report
    return {
      week: this.state.week,
      fundCash: this.state.fund.cash,
      reputation: this.state.firm.reputation,
      lenderTrust: this.state.firm.lenderTrust,
      pipeline: this.state.pipeline.map(d => ({ id: d.id, name: d.name, sector: d.sector, multiple: d.entryMultiple })),
      deals: this.state.deals.map(d => ({ id: d.id, name: d.name, lev: d.leverage, cov: d.covenants })),
      risks: this.state.deals.map(d => ({ id: d.id, breach: checkCovenants(d, this.state.kpis['R'] ?? 0) })),
      suggestions: this.suggestActions()
    }
  }

  private suggestActions(): string[] {
    const s: string[] = []
    if (this.state.pipeline.length) s.push('Consider running an auction on a pipeline target.')
    if (this.state.deals.some(d => d.meters.fragility > 60)) s.push('Reduce fragility: lower leverage or improve execution.')
    if ((this.state.kpis['R'] ?? 0) > 1.5) s.push('Risk stress high: avoid cov-lite this week.')
    return s
  }
}

function clamp(x: number, a: number, b: number) { return Math.max(a, Math.min(b, x)) }
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\prng.ts

```typescript
// Simple Mulberry32 PRNG (deterministic)
export class PRNG {
  private state: number
  constructor(seed: number) {
    this.state = seed >>> 0
  }
  next(): number {
    // returns [0,1)
    let t = this.state += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }
  range(min: number, max: number): number {
    return min + (max - min) * this.next()
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\macro.ts

```typescript
import type { Scenario, EconomyCoeffs } from './types'

export interface MacroStep {
  ER: number; G: number; VX: number; HY: number; IG: number;
  baseSectorMultiple: Record<string, number>
  M: number; R: number;
}

export function computeMacroStep(scn: Scenario, coeffs: EconomyCoeffs, step: number): MacroStep {
  const ER = valueAt(scn.series.sp500_total_return_pct, step) ?? 0
  const G = valueAt(scn.series.gdp_growth_pct, step) ?? 0
  const VX = valueAt(scn.series.vix_level, step) ?? 20
  const HY = valueAt(scn.series.credit_spread_hy_bps, step) ?? 400
  const IG = valueAt(scn.series.credit_spread_ig_bps, step) ?? 120
  const bm = scn.series.base_sector_multiple ?? {}
  const base: Record<string, number> = {}
  for (const k of Object.keys(bm)) base[k] = valueAt(bm[k], step) ?? 8

  const M = clamp(0.5*ER + 0.3*G - 0.02*VX, -2, 2)
  const R = clamp(0.015*VX + 0.002*(HY-400), 0, 3)

  return { ER, G, VX, HY, IG, baseSectorMultiple: base, M, R }
}

function valueAt(arr: number[] | undefined, i: number): number | undefined {
  if (!arr || i < 0) return undefined
  return arr[Math.min(i, arr.length-1)]
}

function clamp(x: number, a: number, b: number): number { return Math.max(a, Math.min(b, x)) }
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\events.ts

```typescript
import type { ActiveEvent, EventDeck, GameState } from './types'

export function spawnEventFromDeck(state: GameState, deck: EventDeck, eventId: string, dealId?: string) {
  const card = deck.events.find(e => e.id === eventId)
  if (!card) return
  state.activeEvents.push({
    id: `${eventId}_${state.day}`,
    card,
    endsOnDay: state.day + card.timer_days,
    dealId
  })
}

export function advanceEvents(state: GameState) {
  // remove expired for now (skeleton)
  state.activeEvents = state.activeEvents.filter(ev => ev.endsOnDay > state.day)
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\difficulty.ts

```typescript
import type { DifficultyPack, Mode } from './types'

export function modeToPack(mode: Mode, pack: DifficultyPack): DifficultyPack {
  // In skeleton, assume provided pack is correct for mode.
  return pack
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\covenants.ts

```typescript
import type { Deal } from './types'

export interface BreachCheck {
  breached: boolean
  which: 'leverage' | 'coverage' | null
}

export function checkCovenants(deal: Deal, R: number): BreachCheck {
  // Simplified: fragility + R raise breach odds
  const lev = deal.leverage
  const Lmax = deal.covenants.Lmax
  const coverage = 2.2 - 0.2 * R - 0.1 * (deal.meters.fragility/20)
  const Imin = deal.covenants.Imin

  if (lev > Lmax) return { breached: true, which: 'leverage' }
  if (coverage < Imin) return { breached: true, which: 'coverage' }
  return { breached: false, which: null }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\capitalStack.ts

```typescript
import type { LenderPolicy } from './types'

export interface TermSheet {
  couponPct: number
  spreadBps: number
  feesOidPct: number
}

export function priceDebt(
  baseRatePct: number,
  leverage: number,
  leverageTarget: number,
  covLite: boolean,
  lenderTrust: number,
  R: number,
  repTier: number,
  policy: LenderPolicy
): TermSheet {
  const b0 = policy?.['pricing_b0'] ?? 300
  const b1 = policy?.['pricing_b1'] ?? 80
  const b2 = policy?.['pricing_b2_covlite'] ?? 50
  const b3 = policy?.['pricing_b3_trust'] ?? 20
  const b4 = policy?.['pricing_b4_R'] ?? 30
  const b5 = policy?.['pricing_b5_rep'] ?? 20

  let spread = b0
  spread += b1 * Math.max(0, (leverage - leverageTarget) / 0.5)
  spread += covLite ? b2 : 0
  spread += b3 * Math.max(0, (50 - lenderTrust)/10)
  spread += b4 * R
  spread -= b5 * repTier

  const spreadPct = spread / 100.0
  const couponPct = baseRatePct + spreadPct
  const feesOidPct = 1.0 + 0.3 * R
  return { couponPct, spreadBps: spread, feesOidPct }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\engine\auctions.ts

```typescript
import { PRNG } from './prng'
import type { Deal, RivalArchetype } from './types'

export interface AuctionResult {
  winner: 'player' | 'rival' | 'walk'
  clearingMultiple: number
  rivalId?: string
}

export function runAuction(prng: PRNG, deal: Deal, rivals: RivalArchetype[], heat: number): AuctionResult {
  // Extremely simplified: player's bid is entryMultiple; rivals bid around base with heat
  const playerBid = deal.entryMultiple
  const rivalBids = rivals.map(r => {
    const discipline = r.discipline
    const noise = (1 - discipline) * (0.4 + 0.6*heat) * prng.range(-1, 1)
    return Math.max(3, deal.baseMultiple + noise + prng.range(0, 1))
  })
  const maxRivalBid = Math.max(...rivalBids)
  if (playerBid >= maxRivalBid * (1 + 0.01 * prng.range(0, 1))) {
    return { winner: 'player', clearingMultiple: playerBid }
  } else if (playerBid < maxRivalBid * 0.92) {
    return { winner: 'walk', clearingMultiple: maxRivalBid }
  } else {
    const i = rivalBids.indexOf(maxRivalBid)
    return { winner: 'rival', clearingMultiple: maxRivalBid, rivalId: rivals[i]?.id }
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './ui/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\store\gameStore.ts

```typescript
import { create } from 'zustand'
import type { GameState, Mode } from '../engine/types'
import { GameEngine, type EngineConfig } from '../engine/state'

interface GameStore {
  engine?: GameEngine
  state?: GameState
  start: (cfg: EngineConfig) => void
  nextDay: () => void
  weeklyReport?: () => ReturnType<GameEngine['weeklyReport']>
  startAuction: (i: number) => any
  priceDebtPreview: (lev: number, covLite: boolean) => any
}

export const useGame = create<GameStore>((set, get) => ({
  start: (cfg) => {
    const engine = new GameEngine(cfg)
    set({ engine, state: engine.state, weeklyReport: engine.weeklyReport.bind(engine), priceDebtPreview: engine.priceDebtPreview.bind(engine) })
  },
  nextDay: () => {
    const { engine } = get()
    if (!engine) return
    engine.tickDay()
    set({ state: engine.state })
  },
  startAuction: (i: number) => {
    const { engine } = get()
    if (!engine) return
    const res = engine.startAuctionForPipeline(i)
    set({ state: engine.state })
    return res
  },
}))
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\ui\App.tsx

```typescript
import React, { useEffect, useMemo, useState } from 'react'
import { useGame } from '../store/gameStore'
import { loadAllConfigs } from '../data/loadConfig'
import type { Mode } from '../engine/types'
import { WeeklyReport } from './WeeklyReport'
import { DealCard } from './DealCard'

export const App: React.FC = () => {
  const start = useGame(s=>s.start)
  const state = useGame(s=>s.state)
  const nextDay = useGame(s=>s.nextDay)
  const weekly = useGame(s=>s.weeklyReport)
  const startAuction = useGame(s=>s.startAuction)

  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<Mode>('medium')
  const [report, setReport] = useState<any>(null)

  useEffect(()=>{
    (async () => {
      const cfg = await loadAllConfigs()
      const scenario = cfg.macro.scenarios[0]
      start({
        mode, seed: 1337,
        scenario, economy: cfg.economy,
        difficulty: cfg.difficulty,
        decks: { takeovers: cfg.takeovers, ops: cfg.ops },
        rivals: cfg.rivals, lenderPolicy: cfg.lender, lpPersonas: cfg.lps
      })
      setReady(true)
    })()
  }, [mode])

  useEffect(()=>{
    if (!weekly) return
    setReport(weekly())
  }, [state, weekly])

  if (!ready || !state) return <div style={{padding:20}}>Loading…</div>

  return <div style={{fontFamily:'Inter, system-ui, sans-serif', padding:16}}>
    <header style={{display:'flex', gap:16, alignItems:'center'}}>
      <h1 style={{margin:0}}>EBITDA — PE Firm (Skeleton)</h1>
      <span>Mode:</span>
      <select value={mode} onChange={e=>setMode(e.target.value as Mode)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div style={{marginLeft:'auto', display:'flex', gap:12}}>
        <button onClick={()=>nextDay()}>Next Day ▶</button>
        <button onClick={()=>{ for(let i=0;i<7;i++) nextDay(); }}>Next Week ▶▶</button>
      </div>
    </header>

    <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16}}>
      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <h3>HQ</h3>
        <p>Day {state.day} • Week {state.week} • Quarter {state.quarter}</p>
        <p>
          Rep {state.firm.reputation.toFixed(1)} • Lender Trust {state.firm.lenderTrust.toFixed(1)} • LP Trust {state.firm.lpTrust.toFixed(1)}
        </p>
        <p>Macro: M {Number(state.kpis['M'] ?? 0).toFixed(2)} • R {Number(state.kpis['R'] ?? 0).toFixed(2)}</p>
      </div>

      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <h3>Pipeline</h3>
        {state.pipeline.length === 0 && <p>No active pipeline. Advance time to refresh (skeleton).</p>}
        {state.pipeline.map((d, i)=>(
          <div key={d.id} style={{display:'flex', justifyContent:'space-between', border:'1px solid #eee', borderRadius:6, padding:8, marginBottom:8}}>
            <div>
              <strong>{d.name}</strong> <small>({d.sector})</small>
              <div>Base mult: {d.baseMultiple.toFixed(1)}× • Ask: {d.entryMultiple.toFixed(1)}×</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>{
                const res = startAuction(i)
                alert(JSON.stringify(res, null, 2))
              }}>Run Auction</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <WeeklyReport report={report}/>
      </div>

      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <h3>Portfolio</h3>
        {state.deals.length===0 && <p>No active deals yet.</p>}
        {state.deals.map(d => <DealCard key={d.id} deal={d} />)}
      </div>
    </section>
  </div>
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\ui\DealCard.tsx

```typescript
import React, { useState } from 'react'
import type { Deal } from '../engine/types'
import { useGame } from '../store/gameStore'

const tabs = ['Thesis','Financing','Ops','Board','Events','Exit'] as const
type Tab = typeof tabs[number]

export const DealCard: React.FC<{deal: Deal}> = ({deal}) => {
  const [tab, setTab] = useState<Tab>('Thesis')
  const priceDebtPreview = useGame(s=>s.priceDebtPreview)

  return <div style={{border:'1px solid #eee', borderRadius:8, padding:8, margin:'8px 0'}}>
    <header style={{display:'flex', justifyContent:'space-between'}}>
      <strong>{deal.name}</strong>
      <span>{deal.sector} • {deal.entryMultiple.toFixed(1)}× • Lev {deal.leverage.toFixed(1)}×</span>
    </header>
    <nav style={{display:'flex', gap:8, marginTop:8}}>
      {tabs.map(t => <button key={t} onClick={()=>setTab(t)} style={{fontWeight: t===tab ? 700 : 400}}>{t}</button>)}
    </nav>
    <section style={{marginTop:8}}>
      {tab === 'Thesis' && <p>Platform thesis & KPIs go here. (skeleton)</p>}
      {tab === 'Financing' && <FinancingTab deal={deal} preview={priceDebtPreview}/>}
      {tab === 'Ops' && <p>100-day plan, bolt-ons, working capital sliders. (skeleton)</p>}
      {tab === 'Board' && <p>Board governance & key approvals. (skeleton)</p>}
      {tab === 'Events' && <p>Event chains (hostiles, TSA, labor). (skeleton)</p>}
      {tab === 'Exit' && <p>Choose Strategic/SBO/IPO; earn-outs, R&W. (skeleton)</p>}
    </section>
  </div>
}

const FinancingTab: React.FC<{deal: Deal, preview: any}> = ({deal, preview}) => {
  const [lev, setLev] = useState(deal.leverage)
  const [covlite, setCovlite] = useState(false)
  const ts = preview ? preview(lev, covlite) : undefined
  return <div>
    <div style={{display:'flex', gap:12, alignItems:'center'}}>
      <label>Leverage: <input type="range" min={2} max={7} step={0.1} value={lev} onChange={e=>setLev(parseFloat(e.target.value))}/></label>
      <span>{lev.toFixed(1)}×</span>
      <label><input type="checkbox" checked={covlite} onChange={e=>setCovlite(e.target.checked)} /> Cov-lite</label>
    </div>
    {ts && <div style={{marginTop:8}}>
      <div>Coupon ≈ {(ts.couponPct*100).toFixed(1)} bps ({(ts.couponPct).toFixed(2)}%)</div>
      <div>Spread ≈ {ts.spreadBps.toFixed(0)} bps</div>
      <div>OID ≈ {ts.feesOidPct.toFixed(2)}%</div>
    </div>}
  </div>
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\src\ui\WeeklyReport.tsx

```typescript
import React from 'react'

export const WeeklyReport: React.FC<{report:any}> = ({report}) => {
  if (!report) return <div>—</div>
  return <div>
    <h3>Weekly Report — Week {report.week}</h3>
    <p>Fund Cash: ${report.fundCash?.toLocaleString?.() ?? 0}</p>
    <h4>Risks</h4>
    <ul>
      {report.risks?.map((r:any)=> <li key={r.id}>
        Deal {r.id}: {r.breach.breached ? `Breach risk (${r.breach.which})` : 'OK'}
      </li>)}
    </ul>
    <h4>Suggestions</h4>
    <ul>
      {report.suggestions?.map((s:string, i:number)=> <li key={i}>{s}</li>)}
    </ul>
  </div>
}
```

---

## Project Configuration Files

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\package.json

```json
{
  "name": "ebitda-skeleton",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.5.4",
    "vite": "^5.3.4"
  }
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": "./src"
  },
  "include": [
    "src"
  ]
}
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### C:\Users\wilso\Downloads\EBITDA\ebitda-skeleton\index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EBITDA — PE Firm: The Game (Skeleton)</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

*This document was generated on 2025-08-24 and contains the complete source code and configuration files for the EBITDA Private Equity Firm game project.*