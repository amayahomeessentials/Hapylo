import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const CATEGORIES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Mops', slug: 'mops', image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBrnCuE7-rLz87EmmaESGtlanlcsGM1A5k6KiJa7WuBAFhXFIbMn0nWvNmJesg9BTKfmOJ70iwThM4lj9tphsuhs5Iy6XH3CwDFtIyJ1i7BYI3RFvEaCyskKAe3yyqd8JXqukOkrkUkA_QqwBiwLqTMEPl-S8Dn8Asi2YVPsFIizdTDwR4hQn4EdEvcjwGHLomB7IaG95eNOjNDg5Q8tc10x2JDN9QKhCqbcHGycxU2T2axWXSP4Cj' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Sprays', slug: 'sprays', image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcO321e61zV44ekjpWAz5bUkBVyPJs2-s-gNIE0STsJvnrSHUV3cQtr-BCmAq3UyyiaQdPlQKXR73nwNYEYZ5LfuE3xpfy1KKzI4nRD97NRgKlQ9WeVifxlvHtrKjjhOe8x4rsg2BtATtsC0seTXiJEj7YL0t8ADI8XlPwDC8MqrUVGdER2O1TUWftdRQDgNOSE79es4wfoKQ5xg4bUsb7kjIZHoGXDagYiQ10IYiQbELKKcHtd5VF' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Cloths', slug: 'cloths', image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnz25zDljef5OatA2zIuBN6NRpIdhNFwF-RsUltbqjOgNSLPT7YLJhVi8_BS7SxID9HnyF5ZxPqeHDvWifSHeXh_dnvPJ2Fbi9RAnDJdQVn8_ArSk52oCNM2z9uT82vRnuL00FYyN7hdkw4lMqdBMgWsI8Y3DggDp1ZlBETWu3cloTiq0hJjdnSeaOePftL4rrpHxZESshTVCGGU36tgJNJFa_OKcEHIR4BgRKx2x_5ybgh-B5ajW6' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Combo Kits', slug: 'combo-kits', image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdbmfvp1qT5camAe4X4O1cLvhlBQnGP-P2yyLLX2SIFRFG-NTTWiRR_L6Xp9M3ECA3fvBfEaRK2fe6hGixgrR8Owz9z_vu-3ZoDklQHzlg7mp1-88m8DGNepUQBt7O1mCPl1akBJfpO1Zf05-yapn3xv01OP_7S_p1ob7wNLJmq2vf0glExZojpLqPRAOaZhmllIBAIjQoclScBvAe-cKlAk4Wk2dDUGizitVeXzb5HT4VVtSEQKZf' }
]

const PRODUCTS = [
  {
    name: 'Concentrated Laundry Wash',
    slug: 'concentrated-laundry-wash',
    description: 'Ultra-concentrated formula powered by plant-based enzymes. Delivers a refreshing clean while protecting fabric fibers. Up to 64 loads per bottle.',
    category_id: '11111111-1111-1111-1111-111111111111',
    price: 24.00,
    compare_at_price: 28.00,
    stock: 100,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALDWEmU63KBYgO02d2nnq-9J1JGWBP_FqqSrBjLWlMvOMvFPAsUkb2yZf6u9p-_09Z6xFVk_Ci1gLzSqBT3c2gWW6QRdbr_NmhOxinYSU5IWd3xTEj58-_iUCxKOKqCr9kCpIjj4EkoLjpOADGwH8gOZvPopD2POze01HFFCOvmtjd0E-aGFhS6zqOncwM38kVcFUOpjisslIFGu1dXvZNFxBJ6drbxht98ImyvF1SPwGLntxkNgtS',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAK4nOrkP-MZHvmDHG1S_VlfU0VqOjWsKxbRr41u9DO0tMhoc8z2lb_8p6SR0vRKwtiaK8uqkyhPQrLgWgK4TlwalrCd-um_EkJ3KNYwBMHn-HBv8zu3YVlxA7n1KuDB_1mTHirDDraG0MqrPRmSk4wunhxehjEyCUVSkupSlkPI8JzuWf_F12ORTaXPVRyr8qvzjRdZKJwhIVPe9vAENC0pL8IOh2F48jQxRKyf1TDU0FfMfEEqoyq',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5BQIeAK_PZOAsmrtjiv4px6QhxOSva5OD_HkNz0P-7YNxrQvcEGHZNZ7JcsbOYmKZUp4OBRYVc9H4toYGFuiM2--ZLWQvGzQ630OwdmyiEsqarWmFkmfcRC-EUsie7jONZAKtB5PKjpAuft9nzUJcm7hqmbC9qDZ7-qyTjvgbn3XhVhK9535JatvFWjqLuMnwLnQt7weLpJffm9Hg1rudIgsbM4pakVDhj4dhxkYjDIHR3uZAEcWp',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBM4p9M1zkufPTw65V3t4rCyDFnuAwKRHNppDXY97hqPt2JAYVKp8ScK8z_2IbQhqEwQhDOwmClUkCGqmaE8GRO71Nq5nAYdUV7z-kq8zfxC6l04y5W3x5JSGy4KAYER7NBrB7xcQYEuFIx78f8W2HGhcwbRsIBUIwtN7iKobXwfbMMTbU2EOPnHDdqqoaG5EgJuyM6Ox_dw1uMigh7hZRefcjY0VUAfsKQSPMxGluHNMAZkLMkChTR',
    ],
    rating: 4.8,
    review_count: 124,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    badge: 'bestseller',
  },
  {
    name: 'Gentle Fabric Softener',
    slug: 'gentle-fabric-softener',
    description: 'Plant-powered softener that keeps fabrics feeling silky and smelling fresh without harsh chemicals.',
    category_id: '11111111-1111-1111-1111-111111111111',
    price: 18.00,
    compare_at_price: null,
    stock: 85,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBGj7L0P7FFOuSBS9aSFuuncOmA__z5038BUgMU5LrMDk_xKt527T6l5t9pbnP8TEt9Gk5bjJoOY32x10lxfX6ME22FImO7WDT1fH6Rx0hdeuRzc02nVqPHhKnIdCkYkqrcEoRuYzbu7-z34Rw7DZbdqCSEBd1K8kWmDsCOARQskVEaZuW14xD4kpb1Q9-xwNMbQBx4VCuz8ni4B0QAXbcFqnxUKyrSJS8opIDfe-z3p75U0EjBhorz'],
    rating: 4.7,
    review_count: 89,
    is_featured: true,
    is_best_seller: false,
    is_active: true,
    badge: null,
  },
  {
    name: 'Stain Remover Spray',
    slug: 'stain-remover-spray',
    description: 'Powerful enzyme-based stain remover. Works on coffee, grease, wine, and more — safe on all fabrics.',
    category_id: '22222222-2222-2222-2222-222222222222',
    price: 14.00,
    compare_at_price: null,
    stock: 60,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAHX-OdZcJyIe-OTGgWxa1DZEX_SXTgii_mnAlkVeKl9HIN9-7nH8QFWhS9o_fICW3IRNnt3DOtSc5v1rW1pWwHwYBo55agqcT12uF3iw1l77-HG26MwdZq69QkSzuu0Q3GKW7xrUkay0Ruu9hLcyCo4uewyqWUYACHMLut6qsNrzHu4Ec2b2Q_hq8g1NVoc6hn4EjlwVAIQW2jQVgGXlLpL4RhgUHEP6D94b3eee5_6fbGqVYPX2ld'],
    rating: 4.6,
    review_count: 54,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    badge: null,
  },
  {
    name: 'Wool Dryer Balls (3-Pack)',
    slug: 'wool-dryer-balls',
    description: 'Reusable wool dryer balls that reduce drying time by up to 25% and naturally soften fabrics.',
    category_id: '11111111-1111-1111-1111-111111111111',
    price: 22.00,
    compare_at_price: null,
    stock: 45,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCZoXwGCeUnYsYiig9jl5x_Bi_ArwAj7tTUs9ZPYB4BrvTgTvYl5QvPecbsc4LjBbijxEAiFToBVFSK9FA7I2NaurWVCqO7P2EacTk0DMn4iz0dx9GNiBaiWL-0JR7bnB_6SZr1alR-yfx0WFlC2erIzT83Ie7Be6aezmvn0O5WRu_J0a875NfIkorGA7kjzTvSw4W2EFZjcROpNINDFjSIgXtZRvN6gf1KXlyJOvoYPTp_MymTvMwh'],
    rating: 4.9,
    review_count: 210,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    badge: 'bestseller',
  },
  {
    name: 'Multi-Surface Cleaner',
    slug: 'multi-surface-cleaner',
    description: 'All-in-one plant-based cleaner safe for kitchen counters, bathroom tiles, glass, and more.',
    category_id: '22222222-2222-2222-2222-222222222222',
    price: 16.00,
    compare_at_price: null,
    stock: 120,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAPNc7-FjeH7Nz-hVQenNnq0kmqq-JJq9C5X9G23rqRwWj9dh9nKDKfU-pu6BQw2ProBoD9IJ0fjhIVY0ENlPbG1abH3BB_WvDI8yYLgMkO1RcnBgq5mQ7UAZ2-o1e32t9f04kAQdoz8AnybM0xu6W8QRwPn4k-XObPkETlsFxsvuox3l5gRJ1H_gO7tBV5fsg0Q7E1UCddioQUh8RBSxnzKBxBg-HRvnNAPM-esSDu2QctuFYgjF00'],
    rating: 4.8,
    review_count: 342,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    badge: 'bestseller',
  },
  {
    name: 'Eco-Laundry Pods',
    slug: 'eco-laundry-pods',
    description: 'Pre-measured pods with concentrated plant enzymes. Zero mess, zero waste, zero compromise.',
    category_id: '11111111-1111-1111-1111-111111111111',
    price: 22.00,
    compare_at_price: 26.00,
    stock: 75,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD1sU4-jDcwFRWwHEAo6ohXdxYGK3w9QsHhCk-XGMGhRqHti8B8pf_dk5YguH9ppOyVGr4CBvyEdBLZRQq82d8FxodGwLWTK-lHGl4Q_RutblhzDdjDGPAAnyOk7xlpNxU3G3QZ59IKKbaGe_wecE06wPQLsvPeJX1noJEsLJEeDBCwbZDKhQmQYrZE1LTU4m6OHzaNnHyFtfOlujVtxA3qYzXnYRffP8a5HG85Ixdwyw7QyWyFbndA'],
    rating: 4.8,
    review_count: 210,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    badge: 'sale',
  },
  {
    name: 'Foaming Hand Soap Trio',
    slug: 'foaming-hand-soap-trio',
    description: 'Set of 3 foaming hand soaps in amber glass bottles. Plant-derived, moisturising, refillable.',
    category_id: '33333333-3333-3333-3333-333333333333',
    price: 28.00,
    compare_at_price: null,
    stock: 50,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAt8zBU35YQ5Q0ic5g5yS-_Eegc0LZAldnilWZdc0imSwO0NBgv8EohoSUkaV1PntoFrWSSWLsUmpS4i9W-Fgb36s_WSzpFzaTc6zvrlt9svCHlOjsK-Y8qtfl1VEI3LzHE9IM0KkgCBbFpdv3_u9hXL-egCGqAUvdkNp0L52wV-1L-uXjtT1MHgzS1UDzd-Wxqvr7gyUAwPy8WP-4SfvzPmC0Ok-gqm7Hh_4c12ZqQ2IDFW0HsDz1N'],
    rating: 4.7,
    review_count: 85,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    badge: null,
  },
  {
    name: 'Linen Room Spray',
    slug: 'linen-room-spray',
    description: 'Natural botanical room spray that freshens the air and eliminates odours. Long-lasting, no harsh chemicals.',
    category_id: '22222222-2222-2222-2222-222222222222',
    price: 16.00,
    compare_at_price: null,
    stock: 90,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuASg6iQ8Ve0Jr6b0Not5_bQQl7Ub3uYiB1aPFUW92ZyIpOVTXGI0kp3lTCOEBlVKwlOTAGHiogc6yAHiLIgnBzhzVXwmvs35i2zmEup8wtTe5_WdLlY4hXm1ApJGdD0k4i2cjgXqpA9ywwnumwFBXYkk_f0G7wdjnBmJoSUmiDjObZUZVnqIL4v4QTYt6f2U5wLaA0Ahz001ne9kwHmEeCx9ZHMs_cZrtwPL82zX6SgkcbmNCnh2ZGT'],
    rating: 4.8,
    review_count: 342,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    badge: 'bestseller',
  },
  {
    name: 'Glass & Mirror Polish',
    slug: 'glass-mirror-polish',
    description: 'Streak-free formula for crystal-clear glass, mirrors, and chrome surfaces. Plant-based, no ammonia.',
    category_id: '22222222-2222-2222-2222-222222222222',
    price: 14.00,
    compare_at_price: null,
    stock: 65,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCjVyygfQwx3hA4p_6OPBjnC7wFlLqYO3HXsaT8YO5oszvBr7FHsOopLvX1Uiu9s-gMWwh7v1JBiS7EX3hppgnN8qvMt0asPeN6JH3iz3gFctJnRUqGUomkik9tglZxcBN0lapcWPeHCwuI5jzZ_QSW7dXAFHCfNiRa0GmUQDtXqB3HIOO5s27WyCYq0-ZNQjt4uDpdtmoNp8rEcVu0u_1vF81at1ljY--LZX0oHoKJQh029Cvj0tEyZ'],
    rating: 4.6,
    review_count: 54,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    badge: null,
  },
  {
    name: 'Multi-Surface Starter Kit',
    slug: 'multi-surface-starter-kit',
    description: 'Everything you need to get started: surface cleaner, dish soap, hand wash, and a microfibre cloth.',
    category_id: '44444444-4444-4444-4444-444444444444',
    price: 34.00,
    compare_at_price: null,
    stock: 30,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBd749dxmKZ9aQd8xjviaBZ2SJQCWumdvf3DU8yWtrUp5jFSCPWEW-XdaAbWfzNWdhWSCr9Mm1uA9zzXxFsdEEMzeuqUFGPI8yhNvlSPX4JMcXaW7Y3smNfFVYiLyCgaxYmlQvppfAoRc03M-APGedlPJ1fFZiwR0tJLCiLmUHbHWmI7qrVx-r9qvzC1lm_5tORaXhAxvoCrdFkdvITO7mjYmiAYzYBg_wP1AjunXmkXBupxdx-P4So'],
    rating: 4.9,
    review_count: 128,
    is_featured: true,
    is_best_seller: true,
    is_active: true,
    badge: 'bestseller',
  },
  {
    name: 'Everyday Surface Cleaner',
    slug: 'everyday-surface-cleaner',
    description: 'Daily-use cleaner for kitchen and bathroom surfaces. Removes grease and grime effortlessly.',
    category_id: '22222222-2222-2222-2222-222222222222',
    price: 14.00,
    compare_at_price: 18.00,
    stock: 200,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAEuPd_GIRQxnIxI8r8K2WyDAEvaIQ3Ix8z0L4A_1lBbgGxFAlW8F5N_HWqgdt7Ch70BdqNCgRSHTlfZtOX0UpTYrah7122x8CPAV54Ekl6m68SMLRDwPWE1aw5DzQwXWIHUW_GBY6R1x9jICZ96BHpNv4_SHBTsT9eu6RPbZ7FkdUwdXQXye7w_LpRlftmOPxfYJZiw1Mh87zn3979pngkp1Oo67JAzoaCcvVEXMydOactvLSu4vrV'],
    rating: 4.9,
    review_count: 128,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    badge: 'sale',
  },
  {
    name: 'Gentle Dish Soap',
    slug: 'gentle-dish-soap',
    description: 'Concentrated dish soap with aloe vera. Cuts through grease without drying hands.',
    category_id: '33333333-3333-3333-3333-333333333333',
    price: 12.00,
    compare_at_price: null,
    stock: 150,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBslJwCiKnUyzwufgzvfENDbn7qY5kNMOIZeZlsb79dIPrkupbWCWM2OhMOv7ZStqd7SyMqBIeTdhuXrKB8elZOGdWb6syHDCLDzyWTrGfdo1xYnBxzex2I-N_S0UWCzOtRLxZ9D1J_nmIeo4cYTovIzKIYkfB5jdTqD3Zeji_d8ILxu9KPeo1jlBuvC59aZ6AqjZT4lmLCmdktU16vmOkqBxPLEdlo1qs-ajEefP1cQcKqKq0WA37F'],
    rating: 4.7,
    review_count: 84,
    is_featured: false,
    is_best_seller: false,
    is_active: true,
    badge: 'eco',
  },
]

async function seed() {
  console.log('Seeding categories...')
  const { error: catError } = await supabase.from('categories').upsert(CATEGORIES)
  if (catError) {
    console.error('Error inserting categories:', catError)
    process.exit(1)
  }

  console.log('Seeding products...')
  const { error: prodError } = await supabase.from('products').upsert(PRODUCTS, { onConflict: 'slug' })
  if (prodError) {
    console.error('Error inserting products:', prodError)
    process.exit(1)
  }

  console.log('Seeding complete!')
}

seed()
