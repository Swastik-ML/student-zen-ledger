
#!/bin/bash

# Generate Supabase types
supabase gen types typescript > src/integrations/supabase/types.ts

# Display success message
echo "Supabase types generated successfully"
