import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { HealthRoute } from '@routes/health.route';
import { ValidateEnv } from '@utils/validateEnv';
import { logger } from '@utils/logger';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new HealthRoute()]);

// Handle the async nature of the listen method
app.listen().catch(error => {
  logger.error(`Server failed to start: ${error.message}`);
  process.exit(1);
});
