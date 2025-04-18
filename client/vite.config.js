import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: 9500,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:9000",
          changeOrigin: true,
        },
      },
      allowedHosts: ["julienbellet.ide.3wa.io"],
    },
  });
};